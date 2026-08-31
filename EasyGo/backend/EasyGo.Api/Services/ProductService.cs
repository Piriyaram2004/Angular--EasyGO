using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyGo.Api.DTOs.Products;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(MapToDto);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product == null ? null : MapToDto(product);
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string? searchTerm)
        {
            var products = await _productRepository.SearchAsync(searchTerm);
            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category)
        {
            var products = await _productRepository.GetByCategoryAsync(category);
            return products.Select(MapToDto);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
        {
            var product = new Product
            {
                Name = createDto.Name.Trim(),
                Price = createDto.Price,
                ImageUrl = createDto.ImageUrl.Trim(),
                InStock = createDto.InStock,
                Description = createDto.Description.Trim(),
                Category = createDto.Category.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var createdProduct = await _productRepository.AddAsync(product);
            return MapToDto(createdProduct);
        }

        public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Name = updateDto.Name.Trim();
            existingProduct.Price = updateDto.Price;
            existingProduct.ImageUrl = updateDto.ImageUrl.Trim();
            existingProduct.InStock = updateDto.InStock;
            existingProduct.Description = updateDto.Description.Trim();
            existingProduct.Category = updateDto.Category.Trim();

            var updated = await _productRepository.UpdateAsync(existingProduct);
            return updated == null ? null : MapToDto(updated);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                InStock = product.InStock,
                Description = product.Description,
                Category = product.Category,
                CreatedAt = product.CreatedAt
            };
        }
    }
}
