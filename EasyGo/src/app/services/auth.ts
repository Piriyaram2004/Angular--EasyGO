import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:5169/api/auth';

  private loggedIn = signal<boolean>(
    localStorage.getItem('easygo_logged_in') === 'true' &&
    !!localStorage.getItem('easygo_token')
  );

  private currentUser = signal<User | null>(
    this.loadSavedUser()
  );

  constructor(private http: HttpClient) {
    console.log('AuthService initialized with API:', this.apiUrl);
  }

  // =========================================================
  // LOGIN (Connected to ASP.NET Core Backend)
  // =========================================================

  async login(
    email: string,
    password: string
  ): Promise<boolean> {

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // 1. Authenticate with ASP.NET Core Web API
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.apiUrl}/login`,
          {
            email: cleanEmail,
            password: cleanPassword
          }
        )
      );

      if (response && response.token) {
        this.saveAuthSession(response);
        return true;
      }
    } catch (err: any) {
      console.warn('Backend login request error:', err);

      // Fallback for default demo credentials if offline
      if (
        cleanEmail === 'admin@easygo.com' &&
        cleanPassword === '123456'
      ) {
        this.loggedIn.set(true);
        localStorage.setItem('easygo_logged_in', 'true');
        return true;
      }

      return false;
    }

    return false;
  }

  // =========================================================
  // REGISTER
  // =========================================================

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.apiUrl}/register`,
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim()
          }
        )
      );

      if (response && response.token) {
        this.saveAuthSession(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  // =========================================================
  // SESSION STORAGE
  // =========================================================

  private saveAuthSession(response: AuthResponse): void {
    const user: User = {
      id: response.id,
      name: response.name,
      email: response.email
    };

    localStorage.setItem('easygo_token', response.token);
    localStorage.setItem('easygo_user', JSON.stringify(user));
    localStorage.setItem('easygo_logged_in', 'true');

    this.currentUser.set(user);
    this.loggedIn.set(true);
  }

  private loadSavedUser(): User | null {
    const saved = localStorage.getItem('easygo_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {
    this.loggedIn.set(false);
    this.currentUser.set(null);

    localStorage.removeItem('easygo_token');
    localStorage.removeItem('easygo_user');
    localStorage.removeItem('easygo_logged_in');
  }

  // =========================================================
  // GETTERS & HELPERS
  // =========================================================

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getToken(): string | null {
    return localStorage.getItem('easygo_token');
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

}