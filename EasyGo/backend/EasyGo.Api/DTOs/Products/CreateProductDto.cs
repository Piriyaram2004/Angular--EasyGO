using System.ComponentModel.DataAnnotations;

namespace EasyGo.Api.DTOs.Products
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 100000.00, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Image URL is required")]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public bool InStock { get; set; } = true;

        [Required(ErrorMessage = "Description is required")]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [RegularExpression("^(Samsung|iPhone)$", ErrorMessage = "Category must be either 'Samsung' or 'iPhone'")]
        public string Category { get; set; } = string.Empty;
    }
}
