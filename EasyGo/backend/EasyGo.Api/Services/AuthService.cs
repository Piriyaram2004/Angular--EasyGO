using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BCryptNet = BCrypt.Net.BCrypt;
using EasyGo.Api.DTOs.Auth;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            ICartRepository cartRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            var emailExists = await _userRepository.EmailExistsAsync(registerDto.Email);
            if (emailExists)
            {
                return null;
            }

            var passwordHash = BCryptNet.HashPassword(registerDto.Password);

            var user = new User
            {
                Name = registerDto.Name.Trim(),
                Email = registerDto.Email.Trim().ToLower(),
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(user);

            // Automatically initialize a cart for new user
            await _cartRepository.CreateCartForUserAsync(createdUser.Id);

            var token = GenerateJwtToken(createdUser);

            return new AuthResponseDto
            {
                Token = token,
                Id = createdUser.Id,
                Name = createdUser.Name,
                Email = createdUser.Email
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return null;
            }

            var isPasswordValid = BCryptNet.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return null;
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Secret Key is not configured.");
            var issuer = _configuration["Jwt:Issuer"] ?? "EasyGoApi";
            var audience = _configuration["Jwt:Audience"] ?? "EasyGoApp";
            var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var minutes) ? minutes : 1440;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
