import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManajemenKaryawanPageRoutingModule } from './manajemen-karyawan-routing.module';

import { ManajemenKaryawanPage } from './manajemen-karyawan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManajemenKaryawanPageRoutingModule
  ],
  declarations: [ManajemenKaryawanPage]
})
export class ManajemenKaryawanPageModule {}
