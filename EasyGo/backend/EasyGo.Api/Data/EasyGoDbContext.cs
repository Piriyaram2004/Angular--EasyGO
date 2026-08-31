using System;
using Microsoft.EntityFrameworkCore;
using EasyGo.Api.Entities;

namespace EasyGo.Api.Data
{
    public class EasyGoDbContext : DbContext
    {
        public EasyGoDbContext(DbContextOptions<EasyGoDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product Configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Price).HasPrecision(18, 2).IsRequired();
                entity.Property(p => p.ImageUrl).IsRequired().HasMaxLength(500);
                entity.Property(p => p.Description).IsRequired().HasMaxLength(1000);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(50);
            });

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(500);

                entity.HasOne(u => u.Cart)
                      .WithOne(c => c.User)
                      .HasForeignKey<Cart>(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Cart Configuration
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.HasMany(c => c.Items)
                      .WithOne(i => i.Cart)
                      .HasForeignKey(i => i.CartId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // CartItem Configuration
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => ci.Id);
                entity.Property(ci => ci.Quantity).IsRequired();

                entity.HasOne(ci => ci.Product)
                      .WithMany()
                      .HasForeignKey(ci => ci.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed 8 Existing Products
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Galaxy S26 Ultra",
                    Price = 1200m,
                    ImageUrl = "https://mobile2000.com/cdn/shop/files/886b499224fc5a83d4cca532841ca4aa.png?v=1774445414&width=1780",
                    InStock = true,
                    Description = "Flagship Samsung phone with a 200MP camera, S Pen support and an all-day battery.",
                    Category = "Samsung",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 2,
                    Name = "Galaxy S26",
                    Price = 799m,
                    ImageUrl = "https://images.samsung.com/is/image/samsung/p6pim/us/s2602/gallery/us-galaxy-s26-s947-sm-s947uzsexaa-550994863?$product-details-jpg$",
                    InStock = true,
                    Description = "Compact everyday Samsung phone with a bright AMOLED screen and fast charging.",
                    Category = "Samsung",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 3,
                    Name = "Galaxy S26 Plus",
                    Price = 999m,
                    ImageUrl = "https://get4lessghana.com/wp-content/uploads/2026/02/s26.png",
                    InStock = false,
                    Description = "Bigger screen, bigger battery, same clean Samsung camera system as the S26.",
                    Category = "Samsung",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 4,
                    Name = "Galaxy S25 Ultra",
                    Price = 1000m,
                    ImageUrl = "https://images.samsung.com/is/image/samsung/p6pim/us/2501/gallery/us-galaxy-s25-s938-sm-s938uzsaxaa-544888025?$product-details-jpg$",
                    InStock = true,
                    Description = "Last year flagship, still fast, now at a friendlier price with the S Pen included.",
                    Category = "Samsung",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 5,
                    Name = "iPhone 17 Pro Max",
                    Price = 1200m,
                    ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Ng3mmLavN5sA45canHOkOnxl-kjfhAfhh099PGnTPT62N94ctRCf_wc&s=10",
                    InStock = true,
                    Description = "Apple largest Pro phone with a titanium body, A19 Pro chip and studio-grade video.",
                    Category = "iPhone",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 6,
                    Name = "iPhone 16 Pro Max",
                    Price = 1099m,
                    ImageUrl = "https://appleasia.lk/cdn/shop/files/iPhone-16-Pro-Max-Black-Titanium-1.png?v=1780579031",
                    InStock = true,
                    Description = "Titanium build, excellent battery life and the camera control button.",
                    Category = "iPhone",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 7,
                    Name = "iPhone 15 Pro Max",
                    Price = 899m,
                    ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_S51kKdw_d94kf3sfTa4pCw2YFTA6z3zZlEynb3C7xA&s=10",
                    InStock = false,
                    Description = "Great value Pro iPhone with a 5x telephoto lens and USB-C charging.",
                    Category = "iPhone",
                    CreatedAt = seedDate
                },
                new Product
                {
                    Id = 8,
                    Name = "iPhone 14 Pro Max",
                    Price = 1000m,
                    ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVhsEQ-BT4SLiHAZ1ijCSMjhi6V9wfIirNAwEO6tOwdA&s=10",
                    InStock = true,
                    Description = "Reliable older Pro model with the Dynamic Island and a dependable camera.",
                    Category = "iPhone",
                    CreatedAt = seedDate
                }
            );
        }
    }
}
