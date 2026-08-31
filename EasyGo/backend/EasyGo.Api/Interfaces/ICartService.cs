using System.Threading.Tasks;
using EasyGo.Api.DTOs.Cart;

namespace EasyGo.Api.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> AddItemAsync(int userId, AddCartItemDto addDto);
        Task<CartDto?> UpdateItemQuantityAsync(int userId, int cartItemId, int quantity);
        Task<CartDto?> RemoveItemAsync(int userId, int cartItemId);
        Task<CartDto> ClearCartAsync(int userId);
    }
}
