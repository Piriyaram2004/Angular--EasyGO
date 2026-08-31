using System.Threading.Tasks;
using EasyGo.Api.DTOs.Auth;

namespace EasyGo.Api.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
