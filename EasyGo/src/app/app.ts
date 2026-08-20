import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCard } from './components/product-card/product-card';
import { ProductList } from './components/product-list/product-list';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCard , ProductList, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EasyGo');

  cartCount = 0;

handleAddToCart(productName: string) {
  this.cartCount++;

  console.log(
    `${productName} added to cart. Total: ${this.cartCount}`
  );
}
}
