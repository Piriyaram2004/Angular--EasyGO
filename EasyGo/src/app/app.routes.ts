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
  // HOME PAGE
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
      // Lazy-loaded Product Details
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
  // ABOUT PAGE
  // =========================================================

  {
    path: 'about',
    component: About
  },


  // =========================================================
  // UNKNOWN ROUTES
  // =========================================================

  {
    path: '**',
    component: NotFound
  }

];