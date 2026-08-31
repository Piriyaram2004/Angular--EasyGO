using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using EasyGo.Api.Data;
using EasyGo.Api.Interfaces;
using EasyGo.Api.Repositories;
using EasyGo.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<EasyGoDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Register Repositories and Services (Dependency Injection)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICartService, CartService>();

// 3. JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "EasyGoApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "EasyGoApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in strict production HTTPS environments
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 4. CORS Configuration for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("EasyGoFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Add Controllers
builder.Services.AddControllers();

// 6. Swagger / OpenAPI Configuration with Bearer Auth
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EasyGo Smartphone E-Commerce API",
        Version = "v1",
        Description = "ASP.NET Core Web API for the EasyGo Smartphone Store with Product, Cart, and Authentication management."
    });

    // Configure JWT Bearer Authorization in Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Seed Default Admin User
using (var scope = app.Services.CreateScope())
{
    var userRepo = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    var cartRepo = scope.ServiceProvider.GetRequiredService<ICartRepository>();
    var exists = await userRepo.EmailExistsAsync("admin@easygo.com");
    if (!exists)
    {
        var adminUser = new EasyGo.Api.Entities.User
        {
            Name = "Admin User",
            Email = "admin@easygo.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            CreatedAt = DateTime.UtcNow
        };
        var created = await userRepo.AddAsync(adminUser);
        await cartRepo.CreateCartForUserAsync(created.Id);
    }
}

// 7. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EasyGo API v1");
        c.DocumentTitle = "EasyGo API - Swagger Documentation";
    });
}

app.UseHttpsRedirection();

// Use Named CORS Policy
app.UseCors("EasyGoFrontend");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map Controller Routes
app.MapControllers();

app.Run();
