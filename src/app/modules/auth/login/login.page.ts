import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  activeTab: 'masuk' | 'daftar' = 'masuk';
  username: string = '';
  password: string = '';

  // Daftar form
  regUsername: string = '';
  regPassword: string = '';
  regConfirmPassword: string = '';

  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  switchTab(tab: 'masuk' | 'daftar') {
    this.activeTab = tab;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) return;

    this.isLoading = true;

    // Simulate login delay
    setTimeout(() => {
      this.isLoading = false;
      // Demo login: any credentials work
      this.router.navigate(['/pos-transaksi']);
    }, 800);
  }

  register() {
    if (!this.regUsername || !this.regPassword || !this.regConfirmPassword) return;
    if (this.regPassword !== this.regConfirmPassword) return;

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.activeTab = 'masuk';
      this.username = this.regUsername;
    }, 800);
  }

  fillDemo() {
    this.username = 'admin';
    this.password = 'admin123';
  }
}