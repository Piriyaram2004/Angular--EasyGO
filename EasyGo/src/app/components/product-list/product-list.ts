import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

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

  products: Product[] = [];

  category = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  get currentSearchTerm(): string {
    return this.productService.getSearchTerm();
  }

  ngOnInit(): void {

    this.products = this.productService.getProducts();

    // Read category from URL
    this.route.queryParams.subscribe(params => {

      this.category = params['category'] || '';

      console.log('Category:', this.category);

    });

    console.log(
      'Product List initialized with',
      this.products.length,
      'products'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Product List changed');
  }

  ngOnDestroy(): void {
    console.log('Product List destroyed');
  }

  get filteredProducts(): Product[] {

    let result = this.productService.searchProducts(
      this.productService.getSearchTerm()
    );

    // Apply category filter
    if (this.category) {

      result = result.filter(
        product =>
          product.category.toLowerCase() ===
          this.category.toLowerCase()
      );

    }

    return result;
  }
}