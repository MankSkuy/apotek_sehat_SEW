import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PosTransaksiPageRoutingModule } from './pos-transaksi-routing.module';

import { PosTransaksiPage } from './pos-transaksi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PosTransaksiPageRoutingModule
  ],
  declarations: [PosTransaksiPage]
})
export class PosTransaksiPageModule {}
