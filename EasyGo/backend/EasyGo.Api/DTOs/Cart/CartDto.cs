using System.Collections.Generic;

namespace EasyGo.Api.DTOs.Cart
{
    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public decimal CartSubtotal { get; set; }
        public decimal DeliveryAmount { get; set; }
        public decimal GrandTotal { get; set; }
        public int TotalItemCount { get; set; }
    }
}
