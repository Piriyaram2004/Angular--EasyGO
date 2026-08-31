using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EasyGo.Api.Data;
using EasyGo.Api.Entities;
using EasyGo.Api.Interfaces;

namespace EasyGo.Api.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly EasyGoDbContext _context;

        public ProductRepository(EasyGoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .AsNoTracking()
                .OrderBy(p => p.Id)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> SearchAsync(string? searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllAsync();
            }

            var term = searchTerm.Trim().ToLower();

            return await _context.Products
                .AsNoTracking()
                .Where(p => p.Name.ToLower().Contains(term) || p.Description.ToLower().Contains(term))
                .OrderBy(p => p.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return await GetAllAsync();
            }

            var cat = category.Trim().ToLower();

            return await _context.Products
                .AsNoTracking()
                .Where(p => p.Category.ToLower() == cat)
                .OrderBy(p => p.Id)
                .ToListAsync();
        }

        public async Task<Product> AddAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(Product product)
        {
            var existing = await _context.Products.FindAsync(product.Id);
            if (existing == null)
            {
                return null;
            }

            existing.Name = product.Name;
            existing.Price = product.Price;
            existing.ImageUrl = product.ImageUrl;
            existing.InStock = product.InStock;
            existing.Description = product.Description;
            existing.Category = product.Category;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
