using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyGo.Api.DTOs.Cart;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Services
{
    public class CartService : ICartService
    {
        private const decimal DeliveryFeeUsd = 50.00m;
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartService(
            ICartRepository cartRepository,
            IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await GetOrCreateCartAsync(userId);
            return MapToCartDto(cart);
        }

        public async Task<CartDto> AddItemAsync(int userId, AddCartItemDto addDto)
        {
            var product = await _productRepository.GetByIdAsync(addDto.ProductId);
            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {addDto.ProductId} was not found.");
            }

            if (!product.InStock)
            {
                throw new InvalidOperationException($"Product '{product.Name}' is currently out of stock.");
            }

            var cart = await GetOrCreateCartAsync(userId);
            var safeQuantity = Math.Clamp(addDto.Quantity, 1, 10);

            await _cartRepository.AddItemAsync(cart.Id, product.Id, safeQuantity);

            var updatedCart = await _cartRepository.GetCartByUserIdAsync(userId);
            return MapToCartDto(updatedCart!);
        }

        public async Task<CartDto?> UpdateItemQuantityAsync(int userId, int cartItemId, int quantity)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return null;
            }

            var cartItem = cart.Items.FirstOrDefault(ci => ci.Id == cartItemId);
            if (cartItem == null)
            {
                return null;
            }

            var safeQuantity = Math.Clamp(quantity, 1, 10);
            await _cartRepository.UpdateItemQuantityAsync(cartItemId, safeQuantity);

            var updatedCart = await _cartRepository.GetCartByUserIdAsync(userId);
            return MapToCartDto(updatedCart!);
        }

        public async Task<CartDto?> RemoveItemAsync(int userId, int cartItemId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return null;
            }

            var cartItem = cart.Items.FirstOrDefault(ci => ci.Id == cartItemId);
            if (cartItem == null)
            {
                return null;
            }

            await _cartRepository.RemoveItemAsync(cartItemId);

            var updatedCart = await _cartRepository.GetCartByUserIdAsync(userId);
            return MapToCartDto(updatedCart!);
        }

        public async Task<CartDto> ClearCartAsync(int userId)
        {
            var cart = await GetOrCreateCartAsync(userId);
            await _cartRepository.ClearCartAsync(cart.Id);

            var updatedCart = await _cartRepository.GetCartByUserIdAsync(userId);
            return MapToCartDto(updatedCart!);
        }

        private async Task<Cart> GetOrCreateCartAsync(int userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = await _cartRepository.CreateCartForUserAsync(userId);
                cart = await _cartRepository.GetCartByUserIdAsync(userId) ?? cart;
            }

            return cart;
        }

        private static CartDto MapToCartDto(Cart cart)
        {
            var itemDtos = cart.Items
                .Where(i => i.Product != null)
                .Select(i => new CartItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? string.Empty,
                    ProductImageUrl = i.Product?.ImageUrl ?? string.Empty,
                    ProductPrice = i.Product?.Price ?? 0m,
                    Quantity = i.Quantity,
                    ItemSubtotal = (i.Product?.Price ?? 0m) * i.Quantity
                })
                .ToList();

            var cartSubtotal = itemDtos.Sum(i => i.ItemSubtotal);
            var deliveryAmount = itemDtos.Any() ? DeliveryFeeUsd : 0m;
            var grandTotal = cartSubtotal + deliveryAmount;
            var totalCount = itemDtos.Sum(i => i.Quantity);

            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = itemDtos,
                CartSubtotal = cartSubtotal,
                DeliveryAmount = deliveryAmount,
                GrandTotal = grandTotal,
                TotalItemCount = totalCount
            };
        }
    }
}
