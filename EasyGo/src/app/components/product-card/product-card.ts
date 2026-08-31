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
    RouterLink,
    Highlight,
    ShortTextPipe
  ],

  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  @Input() productId = 0;

  @Input() name = '';

  @Input() price = 0;

  @Input() imageUrl = '';

  @Input() inStock = true;

  @Input() description = '';

  @Input() productCategory = '';

  showFullDescription = false;

  readonly usdToLkr = 320;

  constructor(
    private productService: ProductService
  ) {}


  get priceInLkr(): number {

    return this.price * this.usdToLkr;

  }


  get deliveryInLkr(): number {

    return 50 * this.usdToLkr;

  }


  get totalInLkr(): number {

    return this.priceInLkr +
           this.deliveryInLkr;

  }


  toggleDescription(): void {

    this.showFullDescription =
      !this.showFullDescription;

  }


  notifyAddToCart(qty: string): void {

    const quantity = Number(qty);

    if (
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {

      return;

    }

    const safeQuantity =
      Math.min(
        Math.floor(quantity),
        10
      );

    this.productService.addToCart(
      this.name,
      safeQuantity
    );

  }

}