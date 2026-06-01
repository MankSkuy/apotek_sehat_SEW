import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class LaporanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
