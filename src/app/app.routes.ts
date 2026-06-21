import { Routes } from '@angular/router';
import { authGuard, ownerGuard, apotekerGuard, kasirGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'data-obat',
    canActivate: [apotekerGuard],
    loadComponent: () => import('./modules/master/data-obat/data-obat.page').then(m => m.DataObatPage)
  },
  {
    path: 'manajemen-batch',
    canActivate: [apotekerGuard],
    loadComponent: () => import('./modules/persediaan/manajemen-batch/manajemen-batch.page').then(m => m.ManajemenBatchPage)
  },
  {
    path: 'pembelian',
    canActivate: [apotekerGuard],
    loadComponent: () => import('./modules/persediaan/pembelian/pembelian.page').then(m => m.PembelianPage)
  },
  {
    path: 'pos-transaksi',
    canActivate: [kasirGuard],
    loadComponent: () => import('./modules/kasir/pos-transaksi/pos-transaksi.page').then(m => m.PosTransaksiPage)
  },
  {
    path: 'laporan',
    canActivate: [kasirGuard],
    loadComponent: () => import('./modules/keuangan/laporan/laporan.page').then(m => m.LaporanPage)
  },
  {
    path: 'jurnal',
    canActivate: [kasirGuard],
    loadComponent: () => import('./modules/keuangan/jurnal/jurnal.page').then(m => m.JurnalPage)
  },
  {
    path: 'manajemen-karyawan',
    canActivate: [ownerGuard],
    loadComponent: () => import('./modules/auth/manajemen-karyawan/manajemen-karyawan.page').then(m => m.ManajemenKaryawanPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];