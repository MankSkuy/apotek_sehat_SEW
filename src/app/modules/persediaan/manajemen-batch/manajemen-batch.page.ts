import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-manajemen-batch',
  templateUrl: './manajemen-batch.page.html',
  styleUrls: ['./manajemen-batch.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class ManajemenBatchPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
