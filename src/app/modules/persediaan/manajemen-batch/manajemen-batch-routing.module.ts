import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManajemenBatchPage } from './manajemen-batch.page';

const routes: Routes = [
  {
    path: '',
    component: ManajemenBatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManajemenBatchPageRoutingModule {}
