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
  @Output() addToCart = new EventEmitter<string>();
  notifyAddToCart() {
  this.addToCart.emit(this.name);
}
;
}
