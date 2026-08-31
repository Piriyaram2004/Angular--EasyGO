import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';

import {
  Product,
  ProductService
} from '../../services/product-service';

@Component({
  selector: 'app-product-details',

  imports: [
    RouterLink,
    CurrencyPipe,
    NgClass
  ],

  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetails implements OnInit {

  // =========================================================
  // PRODUCT
  // =========================================================

  product: Product | undefined;


  // =========================================================
  // CURRENCY
  // =========================================================

  // USD → LKR conversion used by the product cards
  readonly usdToLkr = 320;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}


  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.product =
      this.productService.getProductById(id);

    console.log('Product ID:', id);
    console.log('Product:', this.product);
  }


  // =========================================================
  // PRICE IN LKR
  // =========================================================

  get priceInLkr(): number {

    if (!this.product) {
      return 0;
    }

    return this.product.price * this.usdToLkr;
  }


  // =========================================================
  // DELIVERY
  // =========================================================

  get deliveryInLkr(): number {

    if (!this.product) {
      return 0;
    }

    return 50 * this.usdToLkr;
  }


  // =========================================================
  // TOTAL PRICE
  // =========================================================

  get totalInLkr(): number {

    return this.priceInLkr + this.deliveryInLkr;
  }


  // =========================================================
  // ADD TO CART
  // =========================================================

  addToCart(): void {

    if (!this.product) {
      return;
    }

    if (!this.product.inStock) {
      return;
    }

    this.productService.addToCart(
      this.product.name,
      1
    );

    console.log(
      `${this.product.name} added to cart`
    );
  }

}