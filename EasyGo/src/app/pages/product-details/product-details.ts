import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  Product,
  ProductService
} from '../../services/product-service';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  productId = 0;

  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {

    this.productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.product =
      this.productService.getProductById(this.productId);

  }
}