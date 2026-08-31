import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  Product,
  ProductService
} from '../../services/product-service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    // Get ID from URL
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    // Find product using service
    this.product =
      this.productService.getProductById(id);

    console.log('Product ID:', id);
    console.log('Product:', this.product);
  }
}