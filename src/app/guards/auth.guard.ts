// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};

export const ownerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }

  if (authService.isOwner()) {
    return true;
  }

  // Redirect ke halaman sesuai role
  const role = authService.getRole();
  if (role === 'Apoteker') router.navigateByUrl('/dashboard');
  else router.navigateByUrl('/pos-transaksi');
  return false;
};

export const apotekerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }

  if (authService.isOwner() || authService.isApoteker()) {
    return true;
  }

  router.navigateByUrl('/pos-transaksi');
  return false;
};

export const kasirGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }

  if (authService.isOwner() || authService.isKasir()) {
    return true;
  }

  router.navigateByUrl('/dashboard');
  return false;
};