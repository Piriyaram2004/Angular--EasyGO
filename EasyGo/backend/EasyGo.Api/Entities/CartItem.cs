using System;
using System.ComponentModel.DataAnnotations;

namespace EasyGo.Api.Entities
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Range(1, 10)]
        public int Quantity { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Cart? Cart { get; set; }

        public Product? Product { get; set; }
    }
}
