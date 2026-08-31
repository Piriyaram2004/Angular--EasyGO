import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-navbar',

  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  searchTerm = '';

  mobileMenuOpen = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  // =========================================================
  // CART COUNT
  // =========================================================

  get cartCount(): number {
    return this.productService.getCart().length;
  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearchChange(): void {

    this.productService.setSearchTerm(
      this.searchTerm
    );

    this.router.navigate(['/products']);

  }


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  clearSearch(): void {

    this.searchTerm = '';

    this.productService.setSearchTerm('');

    this.router.navigate(['/products']);

  }


  // =========================================================
  // MOBILE MENU
  // =========================================================

  toggleMobileMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

  }


  closeMobileMenu(): void {

    this.mobileMenuOpen = false;

  }

}