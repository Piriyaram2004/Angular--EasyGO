import { Component, OnInit } from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',

  imports: [
    Navbar,
    RouterOutlet
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  currentUrl = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        this.currentUrl =
          event.urlAfterRedirects;

        console.log(
          'Navigation completed:',
          this.currentUrl
        );

      });

  }

}