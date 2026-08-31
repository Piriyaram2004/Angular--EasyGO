import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import {
  Product,
  ProductService
} from '../../services/product-service';

import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',

  imports: [
    ProductCard
  ],

  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList
  implements OnInit, OnChanges, OnDestroy {

  products: Product[] = [];

  constructor(
    private productService: ProductService
  ) {}


  get currentSearchTerm(): string {

    return this.productService.getSearchTerm();

  }


  ngOnInit(): void {

    this.products =
      this.productService.getProducts();

    console.log(
      'Product List initialized with',
      this.products.length,
      'products'
    );

  }


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    console.log(
      'Product List changed'
    );

  }


  ngOnDestroy(): void {

    console.log(
      'Product List destroyed'
    );

  }


  get filteredProducts(): Product[] {

    return this.productService.searchProducts(
      this.productService.getSearchTerm()
    );

  }

}