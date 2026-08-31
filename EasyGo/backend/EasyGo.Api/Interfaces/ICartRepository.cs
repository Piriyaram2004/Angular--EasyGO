using System.Threading.Tasks;
using EasyGo.Api.Entities;

namespace EasyGo.Api.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetCartByUserIdAsync(int userId);
        Task<Cart> CreateCartForUserAsync(int userId);
        Task<CartItem?> GetCartItemByIdAsync(int cartItemId);
        Task<CartItem> AddItemAsync(int cartId, int productId, int quantity);
        Task<CartItem?> UpdateItemQuantityAsync(int cartItemId, int quantity);
        Task<bool> RemoveItemAsync(int cartItemId);
        Task<bool> ClearCartAsync(int cartId);
    }
}
