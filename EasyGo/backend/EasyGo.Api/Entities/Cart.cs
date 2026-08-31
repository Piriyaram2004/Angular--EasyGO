using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyGo.Api.Entities
{
    public class Cart
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User? User { get; set; }

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
