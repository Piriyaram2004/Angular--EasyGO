using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EasyGo.Api.Data;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly EasyGoDbContext _context;

        public CartRepository(EasyGoDbContext context)
        {
            _context = context;
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> CreateCartForUserAsync(int userId)
        {
            var cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Carts.AddAsync(cart);
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task<CartItem?> GetCartItemByIdAsync(int cartItemId)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);
        }

        public async Task<CartItem> AddItemAsync(int cartId, int productId, int quantity)
        {
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity = Math.Min(10, existingItem.Quantity + quantity);
                await _context.SaveChangesAsync();
                return existingItem;
            }

            var newItem = new CartItem
            {
                CartId = cartId,
                ProductId = productId,
                Quantity = Math.Min(10, Math.Max(1, quantity)),
                CreatedAt = DateTime.UtcNow
            };

            await _context.CartItems.AddAsync(newItem);
            await _context.SaveChangesAsync();

            // Load product navigation
            await _context.Entry(newItem).Reference(i => i.Product).LoadAsync();
            return newItem;
        }

        public async Task<CartItem?> UpdateItemQuantityAsync(int cartItemId, int quantity)
        {
            var item = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

            if (item == null)
            {
                return null;
            }

            item.Quantity = Math.Min(10, Math.Max(1, quantity));
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> RemoveItemAsync(int cartItemId)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item == null)
            {
                return false;
            }

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int cartId)
        {
            var items = await _context.CartItems
                .Where(ci => ci.CartId == cartId)
                .ToListAsync();

            if (!items.Any())
            {
                return true;
            }

            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
