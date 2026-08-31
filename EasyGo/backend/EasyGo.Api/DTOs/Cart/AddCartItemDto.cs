using System.ComponentModel.DataAnnotations;

namespace EasyGo.Api.DTOs.Cart
{
    public class AddCartItemDto
    {
        [Required(ErrorMessage = "ProductId is required")]
        public int ProductId { get; set; }

        [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10")]
        public int Quantity { get; set; } = 1;
    }
}
