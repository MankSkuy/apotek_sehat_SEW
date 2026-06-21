import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'apotek_current_user';

  constructor(private router: Router) {}

  setCurrentUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigateByUrl('/login');
  }

  isOwner(): boolean {
    return this.getCurrentUser()?.role === 'Owner';
  }

  isApoteker(): boolean {
    return this.getCurrentUser()?.role === 'Apoteker';
  }

  isKasir(): boolean {
    return this.getCurrentUser()?.role === 'Kasir';
  }

  // ✅ TAMBAHAN
  getUserId(): number | null {
    return this.getCurrentUser()?.id_karyawan || null;
  }

  getNama(): string {
    return this.getCurrentUser()?.nama || '';
  }

  getRole(): string {
    return this.getCurrentUser()?.role || '';
  }
}