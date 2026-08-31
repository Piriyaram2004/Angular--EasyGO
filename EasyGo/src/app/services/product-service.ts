import { Injectable, signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  description: string;
  category: 'Samsung' | 'iPhone';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // =========================================================
  // PRODUCTS
  // =========================================================

  private products: Product[] = [

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


  // =========================================================
  // CART STATE
  // =========================================================

  private cart = signal<string[]>([]);


  // =========================================================
  // SEARCH STATE
  // =========================================================

  private searchTerm = signal('');


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor() {
    console.log('ProductService created');
  }


  // =========================================================
  // GET ALL PRODUCTS
  // =========================================================

  getProducts(): Product[] {
    return this.products;
  }


  // =========================================================
  // SEARCH PRODUCTS
  // =========================================================

  searchProducts(term: string): Product[] {

    const query = term.toLowerCase().trim();

    if (!query) {
      return this.products;
    }

    return this.products.filter((product) =>
      product.name.toLowerCase().includes(query)
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
  // ADD TO CART
  // =========================================================

  addToCart(
    productName: string,
    qty: number = 1
  ): void {

    const added = Array(qty).fill(productName);

    this.cart.update((items) => [
      ...items,
      ...added
    ]);
  }


  // =========================================================
  // GET CART
  // =========================================================

  getCart(): string[] {
    return this.cart();
  }


  // =========================================================
  // REMOVE ONE ITEM FROM CART
  // =========================================================

  removeFromCart(index: number): void {

    this.cart.update((items) =>
      items.filter((_, i) => i !== index)
    );

  }


  // =========================================================
  // CLEAR ENTIRE CART
  // =========================================================

  clearCart(): void {

    this.cart.set([]);

  }


  // =========================================================
  // GET PRODUCT BY ID
  // =========================================================

  getProductById(
    id: number
  ): Product | undefined {

    return this.products.find(
      (product) => product.id === id
    );
  }


  // =========================================================
  // FILTER BY CATEGORY
  // =========================================================

  getProductsByCategory(
    category: string
  ): Product[] {

    if (!category) {
      return this.products;
    }

    return this.products.filter(
      (product) =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );
  }

}