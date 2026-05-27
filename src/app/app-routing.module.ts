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
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'manajemen-karyawan',
    loadChildren: () => import('./modules/auth/manajemen-karyawan/manajemen-karyawan.module').then( m => m.ManajemenKaryawanPageModule)
  },
  {
    path: 'data-obat',
    loadChildren: () => import('./modules/master/data-obat/data-obat.module').then( m => m.DataObatPageModule)
  },
  {
    path: 'pembelian',
    loadChildren: () => import('./modules/persediaan/pembelian/pembelian.module').then( m => m.PembelianPageModule)
  },
  {
    path: 'manajemen-batch',
    loadChildren: () => import('./modules/persediaan/manajemen-batch/manajemen-batch.module').then( m => m.ManajemenBatchPageModule)
  },
  {
    path: 'pos-transaksi',
    loadChildren: () => import('./modules/kasir/pos-transaksi/pos-transaksi.module').then( m => m.PosTransaksiPageModule)
  },
  {
    path: 'jurnal',
    loadChildren: () => import('./modules/keuangan/jurnal/jurnal.module').then( m => m.JurnalPageModule)
  },
  {
    path: 'laporan',
    loadChildren: () => import('./modules/keuangan/laporan/laporan.module').then( m => m.LaporanPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
