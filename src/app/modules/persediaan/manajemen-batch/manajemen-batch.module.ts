import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManajemenBatchPageRoutingModule } from './manajemen-batch-routing.module';

import { ManajemenBatchPage } from './manajemen-batch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManajemenBatchPageRoutingModule
  ],
  declarations: [ManajemenBatchPage]
})
export class ManajemenBatchPageModule {}
