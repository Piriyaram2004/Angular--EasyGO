import { Component } from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
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
  // REMOVE ONE ITEM
  // =========================================================

  removeItem(index: number): void {

    this.productService.removeFromCart(index);

  }


  // =========================================================
  // CANCEL ALL SHOPPING
  // =========================================================

  cancelShopping(): void {

    this.productService.clearCart();

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}