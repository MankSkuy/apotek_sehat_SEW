import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  userName = '';
  userRole = '';
  warningCount = 0;

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.checkLoginState();
  }

  checkLoginState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getNama();
      this.userRole = this.authService.getRole();
      this.loadWarnings();
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