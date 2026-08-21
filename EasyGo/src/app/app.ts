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
  protected readonly searchTerm = signal('');

  cartCount = 0;
onSearchChange(term: string) {
  this.searchTerm.set(term);
}
handleAddToCart(item: { name: string; qty: number }) {
  this.cartCount += item.qty;
}
}
