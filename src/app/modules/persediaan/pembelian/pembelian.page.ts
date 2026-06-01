import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pembelian',
  templateUrl: './pembelian.page.html',
  styleUrls: ['./pembelian.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class PembelianPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
