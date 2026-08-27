import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input
} from '@angular/core';

import {
  Product,
  ProductService
} from '../../services/product-service';

import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnChanges, OnDestroy {

  @Input() searchTerm = '';

  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products = this.productService.getProducts();

    console.log(
      'Product List initialized with',
      this.products.length,
      'products'
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Product List changed');
  }

  ngOnDestroy() {
    console.log('Product List destroyed');
  }

  get filteredProducts(): Product[] {
    return this.productService.searchProducts(this.searchTerm);
  }
}