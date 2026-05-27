import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JurnalPageRoutingModule } from './jurnal-routing.module';

import { JurnalPage } from './jurnal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JurnalPageRoutingModule
  ],
  declarations: [JurnalPage]
})
export class JurnalPageModule {}
