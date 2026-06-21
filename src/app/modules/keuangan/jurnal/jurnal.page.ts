import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, IonButton, IonSpinner, IonBadge
} from '@ionic/angular/standalone';
import { ApiService } from '../../../services/api.service';
import { addIcons } from 'ionicons';
import { bookOutline, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-jurnal',
  templateUrl: './jurnal.page.html',
  styleUrls: ['./jurnal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,    
    IonToolbar,   
    IonTitle,     
    IonIcon,
    IonButton,
    IonSpinner,
    IonBadge
  ]
})
export class JurnalPage implements OnInit {

  constructor(private apiService: ApiService) {
    addIcons({ bookOutline, refreshOutline });
  }

  ngOnInit() {}
}