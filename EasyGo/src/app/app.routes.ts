import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';

import { Products } from './pages/products/products';
import { ProductList } from './components/product-list/product-list';

import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';


export const routes: Routes = [

  // =========================================================
  // DEFAULT ROUTE
  // =========================================================

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },


  // =========================================================
  // HOME
  // =========================================================

  {
    path: 'home',
    component: Home
  },


  // =========================================================
  // PRODUCTS
  // =========================================================

  {
    path: 'products',
    component: Products,

    children: [

      // /products
      {
        path: '',
        component: ProductList
      },

      // /products/:id
      {
        path: ':id',

        loadComponent: () =>
          import('./pages/product-details/product-details')
            .then(m => m.ProductDetails)
      }

    ]
  },


  // =========================================================
  // CART
  // =========================================================

  {
    path: 'cart',
    component: Cart
  },


  // =========================================================
  // LOGIN
  // =========================================================

  {
    path: 'login',
    component: Login
  },


  // =========================================================
  // ABOUT
  // =========================================================

  {
    path: 'about',
    component: About
  },


  // =========================================================
  // 404 / NOT FOUND
  // =========================================================

  {
    path: '**',
    component: NotFound
  }

];