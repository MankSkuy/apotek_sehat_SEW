import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JurnalPage } from './jurnal.page';

const routes: Routes = [
  {
    path: '',
    component: JurnalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JurnalPageRoutingModule {}
