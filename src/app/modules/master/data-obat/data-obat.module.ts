import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataObatPageRoutingModule } from './data-obat-routing.module';
import { DataObatPage } from './data-obat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataObatPageRoutingModule
  ],
  declarations: [DataObatPage]
})
export class DataObatPageModule {}