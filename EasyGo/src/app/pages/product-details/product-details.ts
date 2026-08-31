import { Component, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  Product,
  ProductService
} from '../../services/product-service';

@Component({
  selector: 'app-product-details',

  imports: [
    RouterLink,
    CurrencyPipe,
    
  ],

  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  // =========================================================
  // PRODUCT
  // =========================================================

  product: Product | undefined;

  productId = 0;


  // =========================================================
  // CURRENCY
  // =========================================================

  readonly usdToLkr = 320;

  readonly deliveryUsd = 50;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}


  // =========================================================
  // INITIALIZE
  // =========================================================

  ngOnInit(): void {

    this.productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.product =
      this.productService.getProductById(
        this.productId
      );

    console.log(
      'Product ID:',
      this.productId
    );

    console.log(
      'Product:',
      this.product
    );

  }


  // =========================================================
  // PRICE IN LKR
  // =========================================================

  get priceInLkr(): number {

    if (!this.product) {
      return 0;
    }

    return (
      this.product.price *
      this.usdToLkr
    );

  }


  // =========================================================
  // DELIVERY IN LKR
  // =========================================================

  get deliveryInLkr(): number {

    return (
      this.deliveryUsd *
      this.usdToLkr
    );

  }


  // =========================================================
  // TOTAL IN LKR
  // =========================================================

  get totalInLkr(): number {

    return (
      this.priceInLkr +
      this.deliveryInLkr
    );

  }

}