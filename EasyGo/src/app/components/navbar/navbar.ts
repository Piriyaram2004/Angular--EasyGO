import { Component,
  Input ,Output,
  EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink , FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
   @Input() cartCount = 0;
    searchTerm = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);
}
clearSearch() {
  this.searchTerm = '';
  this.searchChange.emit('');
}
}