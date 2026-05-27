import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManajemenKaryawanPage } from './manajemen-karyawan.page';

const routes: Routes = [
  {
    path: '',
    component: ManajemenKaryawanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManajemenKaryawanPageRoutingModule {}
