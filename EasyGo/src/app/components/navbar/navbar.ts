import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  searchTerm = '';

  @Output() searchChange = new EventEmitter<string>();

  constructor(private productService: ProductService) {}

  get cartCount(): number {
    return this.productService.getCart().length;
  }

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}