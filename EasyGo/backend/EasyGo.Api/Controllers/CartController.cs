using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EasyGo.Api.DTOs.Cart;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User identifier could not be determined from the security token.");
            }
            return userId;
        }

        // GET: /api/cart
        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }

        // POST: /api/cart/items
        [HttpPost("items")]
        public async Task<ActionResult<CartDto>> AddItem([FromBody] AddCartItemDto addDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            try
            {
                var updatedCart = await _cartService.AddItemAsync(userId, addDto);
                return Ok(updatedCart);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: /api/cart/items/5
        [HttpPut("items/{id:int}")]
        public async Task<ActionResult<CartDto>> UpdateItem(int id, [FromBody] UpdateCartItemDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var updatedCart = await _cartService.UpdateItemQuantityAsync(userId, id, updateDto.Quantity);
            if (updatedCart == null)
            {
                return NotFound(new { message = $"Cart item with ID {id} was not found in your cart." });
            }

            return Ok(updatedCart);
        }

        // DELETE: /api/cart/items/5
        [HttpDelete("items/{id:int}")]
        public async Task<ActionResult<CartDto>> RemoveItem(int id)
        {
            var userId = GetCurrentUserId();
            var updatedCart = await _cartService.RemoveItemAsync(userId, id);
            if (updatedCart == null)
            {
                return NotFound(new { message = $"Cart item with ID {id} was not found in your cart." });
            }

            return Ok(updatedCart);
        }

        // DELETE: /api/cart
        [HttpDelete]
        public async Task<ActionResult<CartDto>> ClearCart()
        {
            var userId = GetCurrentUserId();
            var updatedCart = await _cartService.ClearCartAsync(userId);
            return Ok(updatedCart);
        }
    }
}
