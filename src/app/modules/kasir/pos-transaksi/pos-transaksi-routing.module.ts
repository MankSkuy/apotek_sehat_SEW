import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosTransaksiPage } from './pos-transaksi.page';

const routes: Routes = [
  {
    path: '',
    component: PosTransaksiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosTransaksiPageRoutingModule {}
