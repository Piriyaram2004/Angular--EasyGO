using System.Collections.Generic;
using System.Threading.Tasks;
using EasyGo.Api.Entities;

namespace EasyGo.Api.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> SearchAsync(string? searchTerm);
        Task<IEnumerable<Product>> GetByCategoryAsync(string category);
        Task<Product> AddAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
        Task<bool> DeleteAsync(int id);
    }
}
