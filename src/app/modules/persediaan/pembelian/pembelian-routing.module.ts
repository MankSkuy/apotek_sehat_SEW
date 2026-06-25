import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PembelianPage } from './pembelian.page';

const routes: Routes = [
  {
    path: '',
    component: PembelianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PembelianPageRoutingModule {}
