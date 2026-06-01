import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-jurnal',
  templateUrl: './jurnal.page.html',
  styleUrls: ['./jurnal.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class JurnalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
