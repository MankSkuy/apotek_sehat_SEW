import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medkit, appsOutline, listOutline, cartOutline,
  medkitOutline, barChartOutline, warningOutline,
  personCircleOutline, logOutOutline, peopleOutline
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonRouterOutlet,
    IonIcon
  ]
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  userName = '';
  userRole = '';
  warningCount = 0;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    addIcons({
      medkit, appsOutline, listOutline, cartOutline,
      medkitOutline, barChartOutline, warningOutline,
      personCircleOutline, logOutOutline, peopleOutline
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginState();
    });

    this.checkLoginState();
  }

  checkLoginState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getNama();
      this.userRole = this.authService.getRole();
      if (this.userRole === 'Owner' || this.userRole === 'Apoteker') {
        this.loadWarnings();
      }
    }
  }

  loadWarnings() {
    this.apiService.getBatchWarnings().subscribe({
      next: (data: any) => {
        this.warningCount = data.total_warnings || 0;
      },
      error: () => {}
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userRole = '';
    this.warningCount = 0;
  }
}