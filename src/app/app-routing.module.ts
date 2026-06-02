import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'pos-transaksi',
    loadComponent: () => import('./modules/kasir/pos-transaksi/pos-transaksi.page').then( m => m.PosTransaksiPage)
  },
  {
    path: 'manajemen-batch',
    loadComponent: () => import('./modules/persediaan/manajemen-batch/manajemen-batch.page').then( m => m.ManajemenBatchPage)
  },
  {
    path: 'laporan',
    loadComponent: () => import('./modules/keuangan/laporan/laporan.page').then( m => m.LaporanPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
