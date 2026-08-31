import { Component } from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  ProductService
} from '../../services/product-service';

import {
  AuthService
} from '../../services/auth';

@Component({
  selector: 'app-cart',

  imports: [
    RouterLink
  ],

  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}


  // =========================================================
  // CART ITEMS
  // =========================================================

  get cartItems(): string[] {

    return this.productService.getCart();

  }


  // =========================================================
  // CART COUNT
  // =========================================================

  get cartCount(): number {

    return this.cartItems.length;

  }


  // =========================================================
  // REMOVE ITEM
  // =========================================================

  removeItem(index: number): void {

    this.productService.removeFromCart(
      index
    );

  }


  // =========================================================
  // CLEAR ALL
  // =========================================================

  clearCart(): void {

    if (this.cartCount === 0) {
      return;
    }

    const confirmed =
      confirm(
        'Are you sure you want to cancel all shopping and clear your cart?'
      );

    if (confirmed) {

      this.productService.clearCart();

    }

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}