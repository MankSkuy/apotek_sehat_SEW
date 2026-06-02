import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadComponent: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'manajemen-karyawan',
    loadComponent: () => import('./modules/auth/manajemen-karyawan/manajemen-karyawan.page').then( m => m.ManajemenKaryawanPage)
  },
  {
    path: 'data-obat',
    loadComponent: () => import('./modules/master/data-obat/data-obat.page').then( m => m.DataObatPage)
  },
  {
    path: 'pembelian',
    loadComponent: () => import('./modules/persediaan/pembelian/pembelian.page').then( m => m.PembelianPage)
  },
  {
    path: 'manajemen-batch',
    loadComponent: () => import('./modules/persediaan/manajemen-batch/manajemen-batch.page').then( m => m.ManajemenBatchPage)
  },
  {
    path: 'pos-transaksi',
    loadComponent: () => import('./modules/kasir/pos-transaksi/pos-transaksi.page').then( m => m.PosTransaksiPage)
  },
  {
    path: 'laporan',
    loadComponent: () => import('./modules/keuangan/laporan/laporan.page').then( m => m.LaporanPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
