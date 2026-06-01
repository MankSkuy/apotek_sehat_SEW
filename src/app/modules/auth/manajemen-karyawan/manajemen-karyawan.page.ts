import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-manajemen-karyawan',
  templateUrl: './manajemen-karyawan.page.html',
  styleUrls: ['./manajemen-karyawan.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class ManajemenKaryawanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
