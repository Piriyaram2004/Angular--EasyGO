import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = signal<boolean>(
    localStorage.getItem('easygo_logged_in') === 'true'
  );

  constructor() {
    console.log('AuthService created');
  }


  // =========================================================
  // LOGIN
  // =========================================================

  login(
    email: string,
    password: string
  ): boolean {

    const validEmail = 'admin@easygo.com';
    const validPassword = '123456';

    if (
      email === validEmail &&
      password === validPassword
    ) {

      this.loggedIn.set(true);

      localStorage.setItem(
        'easygo_logged_in',
        'true'
      );

      return true;
    }

    return false;
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.loggedIn.set(false);

    localStorage.removeItem(
      'easygo_logged_in'
    );

  }


  // =========================================================
  // CHECK LOGIN
  // =========================================================

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

}