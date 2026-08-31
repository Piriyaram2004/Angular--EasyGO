import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  description: string;
  category: 'Samsung' | 'iPhone' | string;
}

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  productPrice: number;
  quantity: number;
  itemSubtotal: number;
}

export interface CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  cartSubtotal: number;
  deliveryAmount: number;
  grandTotal: number;
  totalItemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'http://localhost:5169/api';

  // =========================================================
  // INITIAL / DEFAULT 8 PRODUCTS (Seed data matching backend)
  // =========================================================

  private initialProducts: Product[] = [
    {
      id: 1,
      name: 'Galaxy S26 Ultra',
      price: 1200,
      imageUrl:
        'https://mobile2000.com/cdn/shop/files/886b499224fc5a83d4cca532841ca4aa.png?v=1774445414&width=1780',
      inStock: true,
      description:
        'Flagship Samsung phone with a 200MP camera, S Pen support and an all-day battery.',
      category: 'Samsung'
    },
    {
      id: 2,
      name: 'Galaxy S26',
      price: 799,
      imageUrl:
        'https://images.samsung.com/is/image/samsung/p6pim/us/s2602/gallery/us-galaxy-s26-s947-sm-s947uzsexaa-550994863?$product-details-jpg$',
      inStock: true,
      description:
        'Compact everyday Samsung phone with a bright AMOLED screen and fast charging.',
      category: 'Samsung'
    },
    {
      id: 3,
      name: 'Galaxy S26 Plus',
      price: 999,
      imageUrl:
        'https://get4lessghana.com/wp-content/uploads/2026/02/s26.png',
      inStock: false,
      description:
        'Bigger screen, bigger battery, same clean Samsung camera system as the S26.',
      category: 'Samsung'
    },
    {
      id: 4,
      name: 'Galaxy S25 Ultra',
      price: 1000,
      imageUrl:
        'https://images.samsung.com/is/image/samsung/p6pim/us/2501/gallery/us-galaxy-s25-s938-sm-s938uzsaxaa-544888025?$product-details-jpg$',
      inStock: true,
      description:
        'Last year flagship, still fast, now at a friendlier price with the S Pen included.',
      category: 'Samsung'
    },
    {
      id: 5,
      name: 'iPhone 17 Pro Max',
      price: 1200,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Ng3mmLavN5sA45canHOkOnxl-kjfhAfhh099PGnTPT62N94ctRCf_wc&s=10',
      inStock: true,
      description:
        'Apple largest Pro phone with a titanium body, A19 Pro chip and studio-grade video.',
      category: 'iPhone'
    },
    {
      id: 6,
      name: 'iPhone 16 Pro Max',
      price: 1099,
      imageUrl:
        'https://appleasia.lk/cdn/shop/files/iPhone-16-Pro-Max-Black-Titanium-1.png?v=1780579031',
      inStock: true,
      description:
        'Titanium build, excellent battery life and the camera control button.',
      category: 'iPhone'
    },
    {
      id: 7,
      name: 'iPhone 15 Pro Max',
      price: 899,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_S51kKdw_d94kf3sfTa4pCw2YFTA6z3zZlEynb3C7xA&s=10',
      inStock: false,
      description:
        'Great value Pro iPhone with a 5x telephoto lens and USB-C charging.',
      category: 'iPhone'
    },
    {
      id: 8,
      name: 'iPhone 14 Pro Max',
      price: 1000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVhsEQ-BT4SLiHAZ1ijCSMjhi6V9wfIirNAwEO6tOwdA&s=10',
      inStock: true,
      description:
        'Reliable older Pro model with the Dynamic Island and a dependable camera.',
      category: 'iPhone'
    }
  ];

  private products = signal<Product[]>(this.initialProducts);

  // =========================================================
  // CART STATE
  // =========================================================

  private cart = signal<string[]>(
    this.loadCart()
  );

  // =========================================================
  // SEARCH STATE
  // =========================================================

  private searchTerm = signal('');

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('ProductService connected to backend:', this.apiUrl);
    this.fetchProductsFromBackend();
    this.syncCartWithBackend();
  }

  // =========================================================
  // FETCH PRODUCTS FROM ASP.NET CORE BACKEND
  // =========================================================

  fetchProductsFromBackend(): void {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.products.set(data);
          console.log('Fetched products from backend API:', data.length);
        }
      },
      error: (err) => {
        console.warn('Could not fetch products from backend, using cached products:', err);
      }
    });
  }

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  getProducts(): Product[] {
    return this.products();
  }

  // =========================================================
  // SEARCH PRODUCTS
  // =========================================================

  searchProducts(term: string): Product[] {
    const query = term.toLowerCase().trim();

    if (!query) {
      return this.products();
    }

    return this.products().filter(
      product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // =========================================================
  // SEARCH TERM
  // =========================================================

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  getSearchTerm(): string {
    return this.searchTerm();
  }

  // =========================================================
  // ADD TO CART (Syncs with ASP.NET Core Backend)
  // =========================================================

  addToCart(
    productName: string,
    qty: number = 1
  ): void {

    const quantity = Math.max(
      1,
      Math.min(
        10,
        Math.floor(qty)
      )
    );

    const addedItems = Array(
      quantity
    ).fill(productName);

    this.cart.update(
      items => {
        const updatedItems = [
          ...items,
          ...addedItems
        ];
        this.saveCart(updatedItems);
        return updatedItems;
      }
    );

    // If authenticated, sync with backend Cart API
    if (this.authService.isLoggedIn()) {
      const product = this.products().find(p => p.name.toLowerCase() === productName.toLowerCase());
      if (product && product.inStock) {
        this.http.post<CartDto>(
          `${this.apiUrl}/cart/items`,
          {
            productId: product.id,
            quantity: quantity
          },
          { headers: this.authService.getAuthHeaders() }
        ).subscribe({
          next: () => console.log(`Synced ${product.name} to backend cart`),
          error: (err) => console.warn('Error syncing cart to backend:', err)
        });
      }
    }

  }

  // =========================================================
  // GET CART
  // =========================================================

  getCart(): string[] {
    return this.cart();
  }

  // =========================================================
  // REMOVE ONE ITEM
  // =========================================================

  removeFromCart(index: number): void {
    this.cart.update(
      items => {
        const updatedItems = items.filter((_, i) => i !== index);
        this.saveCart(updatedItems);
        return updatedItems;
      }
    );
  }

  // =========================================================
  // CLEAR CART
  // =========================================================

  clearCart(): void {
    this.cart.set([]);
    localStorage.removeItem('easygo-cart');

    if (this.authService.isLoggedIn()) {
      this.http.delete<CartDto>(
        `${this.apiUrl}/cart`,
        { headers: this.authService.getAuthHeaders() }
      ).subscribe({
        next: () => console.log('Cleared backend cart'),
        error: (err) => console.warn('Error clearing backend cart:', err)
      });
    }
  }

  // =========================================================
  // SYNC CART WITH BACKEND
  // =========================================================

  private syncCartWithBackend(): void {
    if (!this.authService.isLoggedIn()) return;

    this.http.get<CartDto>(
      `${this.apiUrl}/cart`,
      { headers: this.authService.getAuthHeaders() }
    ).subscribe({
      next: (backendCart) => {
        if (backendCart && backendCart.items && backendCart.items.length > 0) {
          const items: string[] = [];
          for (const item of backendCart.items) {
            for (let i = 0; i < item.quantity; i++) {
              items.push(item.productName);
            }
          }
          this.cart.set(items);
          this.saveCart(items);
        }
      },
      error: (err) => console.warn('Could not fetch backend cart:', err)
    });
  }

  // =========================================================
  // SAVE CART
  // =========================================================

  private saveCart(
    items: string[]
  ): void {
    localStorage.setItem(
      'easygo-cart',
      JSON.stringify(items)
    );
  }

  // =========================================================
  // LOAD CART
  // =========================================================

  private loadCart(): string[] {
    const savedCart = localStorage.getItem('easygo-cart');
    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  }

  // =========================================================
  // GET PRODUCT BY ID
  // =========================================================

  getProductById(
    id: number
  ): Product | undefined {
    return this.products().find(
      product => product.id === id
    );
  }

  // =========================================================
  // FILTER BY CATEGORY
  // =========================================================

  getProductsByCategory(
    category: string
  ): Product[] {
    if (!category) {
      return this.products();
    }

    return this.products().filter(
      product =>
        product.category.toLowerCase() === category.toLowerCase()
    );
  }

}