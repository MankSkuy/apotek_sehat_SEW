import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PembelianPageRoutingModule } from './pembelian-routing.module';

import { PembelianPage } from './pembelian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PembelianPageRoutingModule
  ],
  declarations: [PembelianPage]
})
export class PembelianPageModule {}
