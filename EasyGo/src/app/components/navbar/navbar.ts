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

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  get cartCount(): number {
    return this.productService.getCart().length;
  }

  onSearchChange() {
    this.productService.setSearchTerm(this.searchTerm);

    // Search results belong on the products page
    this.router.navigate(['/products']);
  }

  clearSearch() {
    this.searchTerm = '';

    this.productService.setSearchTerm('');

    this.router.navigate(['/products']);
  }
}