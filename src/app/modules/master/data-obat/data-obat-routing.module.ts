import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataObatPage } from './data-obat.page';

const routes: Routes = [
  {
    path: '',
    component: DataObatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataObatPageRoutingModule {}
