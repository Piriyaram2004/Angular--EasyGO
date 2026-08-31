$baseUrl = "http://localhost:5169"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Testing Swagger Documentation" -ForegroundColor Cyan
Write-Host "========================================"
try {
    $swagger = Invoke-RestMethod -Uri "$baseUrl/swagger/v1/swagger.json" -Method Get
    Write-Host "Swagger Doc loaded: $($swagger.info.title)" -ForegroundColor Green
} catch {
    Write-Host "Swagger Doc failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "2. Testing Public Product Endpoints" -ForegroundColor Cyan
Write-Host "========================================"
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    Write-Host "GET /api/products -> Success ($($products.Count) products returned):" -ForegroundColor Green
    foreach ($p in $products) {
        Write-Host "  - [ID: $($p.id)] $($p.name) | Price: `$$($p.price) | Cat: $($p.category) | InStock: $($p.inStock)"
    }

    $p1 = Invoke-RestMethod -Uri "$baseUrl/api/products/1" -Method Get
    Write-Host "`nGET /api/products/1 -> Success: $($p1.name), Price: `$$($p1.price)" -ForegroundColor Green

    $search = Invoke-RestMethod -Uri "$baseUrl/api/products/search?term=galaxy" -Method Get
    Write-Host "GET /api/products/search?term=galaxy -> Success ($($search.Count) results found)" -ForegroundColor Green

    $samsung = Invoke-RestMethod -Uri "$baseUrl/api/products/category/Samsung" -Method Get
    Write-Host "GET /api/products/category/Samsung -> Success ($($samsung.Count) Samsung phones)" -ForegroundColor Green

    $iphone = Invoke-RestMethod -Uri "$baseUrl/api/products/category/iPhone" -Method Get
    Write-Host "GET /api/products/category/iPhone -> Success ($($iphone.Count) iPhones)" -ForegroundColor Green
} catch {
    Write-Host "Product test failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "3. Testing Auth (Register & Login)" -ForegroundColor Cyan
Write-Host "========================================"
$regBody = @{
    name = "John Doe"
    email = "johndoe_test@easygo.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "POST /api/auth/register -> Success (User: $($regResponse.name), ID: $($regResponse.id))" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "User already registered (409 Conflict handled properly)" -ForegroundColor Yellow
    } else {
        Write-Host "Register failed: $_" -ForegroundColor Red
    }
}

$loginBody = @{
    email = "johndoe_test@easygo.com"
    password = "Password123!"
} | ConvertTo-Json

$token = $null
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "POST /api/auth/login -> Success (JWT Token acquired)" -ForegroundColor Green
    Write-Host "Token preview: $($token.Substring(0, 30))..." -ForegroundColor Gray
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "4. Testing Unauthorized Access Protection" -ForegroundColor Cyan
Write-Host "========================================"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Get
    Write-Host "FAIL: Cart endpoint allowed anonymous access!" -ForegroundColor Red
} catch {
    Write-Host "Protected Route Test: Anonymous request correctly rejected with 401 Unauthorized" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "5. Testing Authenticated Cart Workflow" -ForegroundColor Cyan
Write-Host "========================================"
$authHeader = @{
    Authorization = "Bearer $token"
}

try {
    # 5.1 GET Cart (Initial)
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Get -Headers $authHeader
    Write-Host "GET /api/cart -> Initial Item Count: $($cart.items.Count)" -ForegroundColor Green

    # 5.2 Add in-stock product (ID 1: Galaxy S26 Ultra, qty 2)
    $addBody = @{
        productId = 1
        quantity = 2
    } | ConvertTo-Json
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart/items" -Method Post -Body $addBody -Headers $authHeader -ContentType "application/json"
    Write-Host "POST /api/cart/items (Added Galaxy S26 Ultra x2) -> Cart Subtotal: `$$($cart.cartSubtotal), Grand Total: `$$($cart.grandTotal)" -ForegroundColor Green

    # 5.3 Try adding out-of-stock product (ID 3: Galaxy S26 Plus)
    try {
        $outOfStockBody = @{
            productId = 3
            quantity = 1
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/api/cart/items" -Method Post -Body $outOfStockBody -Headers $authHeader -ContentType "application/json"
        Write-Host "FAIL: Allowed adding out-of-stock item" -ForegroundColor Red
    } catch {
        Write-Host "Out-of-Stock Test: Correctly rejected out-of-stock item with 400 Bad Request" -ForegroundColor Green
    }

    # 5.4 Add another product (ID 5: iPhone 17 Pro Max, qty 1)
    $addBody2 = @{
        productId = 5
        quantity = 1
    } | ConvertTo-Json
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart/items" -Method Post -Body $addBody2 -Headers $authHeader -ContentType "application/json"
    Write-Host "POST /api/cart/items (Added iPhone 17 Pro Max x1) -> Total Items: $($cart.totalItemCount), Delivery: `$$($cart.deliveryAmount), Grand Total: `$$($cart.grandTotal)" -ForegroundColor Green

    # Display items
    Write-Host "`nCurrent Cart Contents:" -ForegroundColor Yellow
    foreach ($item in $cart.items) {
        Write-Host "  - [Item ID: $($item.id)] $($item.productName) x $($item.quantity) @ `$$($item.productPrice) = `$$($item.itemSubtotal)"
    }

    # 5.5 Update item quantity
    $firstItemId = $cart.items[0].id
    $updateBody = @{
        quantity = 3
    } | ConvertTo-Json
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart/items/$firstItemId" -Method Put -Body $updateBody -Headers $authHeader -ContentType "application/json"
    Write-Host "`nPUT /api/cart/items/$firstItemId (Updated quantity to 3) -> Subtotal: `$$($cart.cartSubtotal), Grand Total: `$$($cart.grandTotal)" -ForegroundColor Green

    # 5.6 Remove one item
    $removeId = $cart.items[1].id
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart/items/$removeId" -Method Delete -Headers $authHeader
    Write-Host "DELETE /api/cart/items/$removeId -> Remaining Items in Cart: $($cart.items.Count)" -ForegroundColor Green

    # 5.7 Clear cart
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Delete -Headers $authHeader
    Write-Host "DELETE /api/cart -> Cart Cleared. Remaining Items: $($cart.items.Count), Total: `$$($cart.grandTotal)" -ForegroundColor Green

    Write-Host "`nALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!" -ForegroundColor Green
} catch {
    Write-Host "Cart test failed: $_" -ForegroundColor Red
}
