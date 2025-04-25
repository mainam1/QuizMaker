
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'my_app_jwt'; // Key for localStorage
  isCreator: any;

  constructor(private http: HttpClient) {}

  // Send login request to backend
  login(email: string, password: string) {
    return this.http.post<{ token: string }>('http://localhost:8080/api/login', { email, password })
      .pipe(
        tap(response => {
          // Save the JWT to localStorage
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get the stored JWT
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Log out by removing the JWT
  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
