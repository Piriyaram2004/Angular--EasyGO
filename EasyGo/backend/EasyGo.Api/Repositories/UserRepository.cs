using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EasyGo.Api.Data;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly EasyGoDbContext _context;

        public UserRepository(EasyGoDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLower();
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        }

        public async Task<User> AddAsync(User user)
        {
            user.Email = user.Email.Trim().ToLower();
            user.CreatedAt = DateTime.UtcNow;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLower();
            return await _context.Users
                .AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        }
    }
}
