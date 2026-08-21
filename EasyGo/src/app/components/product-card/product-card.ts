import { Component , Input , Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() name = '';
  @Input () price = 0;
  @Input () imageUrl = '';
  @Input() inStock: boolean = true;
@Output() addToCart =
  new EventEmitter<{ name: string; qty: number }>();

notifyAddToCart(qty: string) {
  this.addToCart.emit({
    name: this.name,
    qty: Number(qty) || 1
  });
}
}

