import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-data-obat',
  templateUrl: './data-obat.page.html',
  styleUrls: ['./data-obat.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class DataObatPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
