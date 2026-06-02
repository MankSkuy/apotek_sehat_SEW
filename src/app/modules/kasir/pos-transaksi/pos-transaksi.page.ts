import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pos-transaksi',
  templateUrl: './pos-transaksi.page.html',
  styleUrls: ['./pos-transaksi.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class PosTransaksiPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
