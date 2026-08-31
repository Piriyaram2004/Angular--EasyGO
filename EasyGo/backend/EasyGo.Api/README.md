# EasyGo Smartphone Store - ASP.NET Core Web API Backend

A clean, modern, and production-ready ASP.NET Core Web API built for the EasyGo Smartphone E-Commerce application.

---

## 1. Technology Stack & Requirements

- **Framework**: .NET 8.0 (LTS)
- **Language**: C# 12
- **Database**: Microsoft SQL Server (LocalDB / SQL Server Express / Full)
- **ORM**: Entity Framework Core 8.0 with Code-First Migrations & Fluent API
- **Security**: JWT (JSON Web Tokens) with HMAC-SHA256 & BCrypt password hashing
- **Documentation**: Swagger / OpenAPI with Bearer Token Authorization support
- **CORS**: Configured for Angular frontend (`http://localhost:4200`)

---

## 2. Project Architecture

The backend follows a layered, decoupled architecture with Dependency Injection:

```
EasyGo.Api/
├── Controllers/         # API Controllers (Thin, routing & status codes)
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   └── CartController.cs
├── Services/            # Business Logic & DTO transformations
│   ├── AuthService.cs
│   ├── ProductService.cs
│   └── CartService.cs
├── Repositories/        # Database queries & data operations
│   ├── UserRepository.cs
│   ├── ProductRepository.cs
│   └── CartRepository.cs
├── Interfaces/          # Abstraction contracts for DI
│   ├── IAuthService.cs
│   ├── IProductService.cs
│   ├── ICartService.cs
│   ├── IUserRepository.cs
│   ├── IProductRepository.cs
│   └── ICartRepository.cs
├── Data/                # EF Core DbContext & Fluent API configurations
│   └── EasyGoDbContext.cs
├── Entities/            # Database Domain Models
│   ├── Product.cs
│   ├── User.cs
│   ├── Cart.cs
│   └── CartItem.cs
├── DTOs/                # Data Transfer Objects with DataAnnotations
│   ├── Auth/
│   ├── Products/
│   └── Cart/
├── Migrations/          # EF Core Migrations & Seed Data
├── Properties/
│   └── launchSettings.json
├── appsettings.json     # Configuration (Connection Strings, JWT)
├── Program.cs           # Application Startup, DI, Middleware pipeline
└── EasyGo.Api.csproj
```

---

## 3. Database & Connection String Configuration

The connection string is defined in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=EasyGoDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> **Note for other SQL Server setups:**
> If you are using SQL Server Express instead of LocalDB, update the connection string to:
> `"Server=localhost\\SQLEXPRESS;Database=EasyGoDb;Trusted_Connection=True;TrustServerCertificate=True;"`

---

## 4. JWT Authentication Configuration

Configured in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "EasyGo_Super_Secret_Jwt_Key_2026_For_Api_Security_And_Validation!",
    "Issuer": "EasyGoApi",
    "Audience": "EasyGoApp",
    "ExpiryMinutes": 1440
  }
}
```

The JWT token contains the following claims:
- `sub` / `ClaimTypes.NameIdentifier`: User ID (`int`)
- `email` / `ClaimTypes.Email`: User email address
- `name` / `ClaimTypes.Name`: User full name
- `jti`: Unique token identifier

---

## 5. How to Build & Run the API

### Step 1: Restore and Build
```powershell
cd EasyGo/backend/EasyGo.Api
dotnet restore
dotnet build
```

### Step 2: Create / Update the Database
The initial migration is already included. To apply it to your database:
```powershell
dotnet ef database update
```

*(If `dotnet-ef` is not installed on your machine, install it using: `dotnet tool install --global dotnet-ef`)*

### Step 3: Run the API
```powershell
dotnet run --launch-profile http
```
The API will start listening at:
- **API Base URL**: `http://localhost:5169`
- **Swagger Documentation**: `http://localhost:5169/swagger`

---

## 6. API Endpoints

### 📱 Product Endpoints (Public)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (seeded with 8 smartphone models) |
| `GET` | `/api/products/{id}` | Retrieve single product details by ID |
| `GET` | `/api/products/search?term={term}` | Search products by name/description (e.g. `?term=galaxy`) |
| `GET` | `/api/products/category/{category}` | Filter products by category (`Samsung` or `iPhone`) |
| `POST` | `/api/products` | Add new product |
| `PUT` | `/api/products/{id}` | Update existing product |
| `DELETE` | `/api/products/{id}` | Delete product |

### 🔐 Authentication Endpoints (Public)

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ "name": "...", "email": "...", "password": "..." }` | `201 Created` with JWT Token & User Info |
| `POST` | `/api/auth/login` | `{ "email": "...", "password": "..." }` | `200 OK` with JWT Token & User Info |

### 🛒 Cart Endpoints (Protected - Requires `Authorization: Bearer {token}`)

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/api/cart` | None | Retrieve user's cart, items, subtotal, delivery ($50), and grand total |
| `POST` | `/api/cart/items` | `{ "productId": 1, "quantity": 1 }` | Add item to user's cart (checks stock availability) |
| `PUT` | `/api/cart/items/{id}` | `{ "quantity": 3 }` | Update cart item quantity (1-10) |
| `DELETE` | `/api/cart/items/{id}` | None | Remove specific item from cart |
| `DELETE` | `/api/cart` | None | Clear entire cart |

---

## 7. Angular Frontend Integration Guide

Here is how the current Angular frontend functions map directly to the ASP.NET Core Web API:

### 1. Products Mapping
| Angular (`ProductService`) | Backend API Endpoint |
|---|---|
| `productService.getProducts()` | `GET http://localhost:5169/api/products` |
| `productService.getProductById(id)` | `GET http://localhost:5169/api/products/{id}` |
| `productService.searchProducts(term)` | `GET http://localhost:5169/api/products/search?term={term}` |
| `productService.getProductsByCategory(cat)` | `GET http://localhost:5169/api/products/category/{cat}` |

### 2. Authentication Mapping
| Angular (`AuthService`) | Backend API Endpoint |
|---|---|
| `authService.login(email, password)` | `POST http://localhost:5169/api/auth/login`<br/>Save returned `token` into `localStorage.setItem('easygo_token', token)` |
| *Registration* | `POST http://localhost:5169/api/auth/register` |
| `authService.logout()` | Remove token from `localStorage` |

### 3. Cart Mapping
| Angular (`ProductService` / `Cart`) | Backend API Endpoint (Send `Bearer {token}`) |
|---|---|
| `productService.getCart()` | `GET http://localhost:5169/api/cart` |
| `productService.addToCart(productId, qty)` | `POST http://localhost:5169/api/cart/items` with `{ productId, quantity }` |
| `productService.removeFromCart(itemId)` | `DELETE http://localhost:5169/api/cart/items/{itemId}` |
| `productService.clearCart()` | `DELETE http://localhost:5169/api/cart` |

### 4. Pricing & Exchange Rates
- All database base prices are stored in **USD**.
- The frontend currency conversion remains:
  $$\text{Price in LKR} = \text{Base USD Price} \times 320$$
  $$\text{Delivery in LKR} = \$50 \times 320 = \text{LKR } 16,000$$

---

## 8. Testing in Swagger UI
1. Navigate to `http://localhost:5169/swagger`.
2. Register a new user under `POST /api/auth/register` or login under `POST /api/auth/login`.
3. Copy the `token` from the response.
4. Click the green **Authorize** button at the top of Swagger UI.
5. Paste the token in the value field (e.g. `eyJhbGciOi...`).
6. Click **Authorize**, then test any protected `/api/cart` endpoint!
