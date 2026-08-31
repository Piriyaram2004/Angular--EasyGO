import {
  Component,
  Input
} from '@angular/core';

import {
  NgClass,
  NgStyle,
  UpperCasePipe,
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { Highlight } from '../../directives/highlight';
import { ShortTextPipe } from '../../pipes/short-text-pipe';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-card',

  imports: [
    NgClass,
    NgStyle,
    UpperCasePipe,
    CurrencyPipe,
    DecimalPipe,
    Highlight,
    ShortTextPipe,
    RouterLink,
  ],

  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input() productId = 0;

  @Input() name = '';

  @Input() price = 0;

  @Input() imageUrl = '';

  @Input() inStock = true;

  @Input() description = '';

  showFullDescription = false;

  readonly usdToLkr = 320;

  constructor(private productService: ProductService) {}

  get priceInLkr() {
    return this.price * this.usdToLkr;
  }

  get totalInLkr() {
    return (this.price + 50) * this.usdToLkr;
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  notifyAddToCart(qty: string) {

    this.productService.addToCart(
      this.name,
      Number(qty) || 1
    );

  }

}