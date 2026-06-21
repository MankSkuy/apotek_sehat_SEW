import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medkit, personOutline, lockClosedOutline, eyeOutline,
  eyeOffOutline, logInOutline, personAddOutline, alertCircleOutline,
  atOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class LoginPage implements OnInit {

  activeTab: 'masuk' | 'daftar' = 'masuk';

  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMsg: string = '';

  regNama: string = '';
  regUsername: string = '';
  regPassword: string = '';
  isRegistering: boolean = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    addIcons({
      medkit, personOutline, lockClosedOutline, eyeOutline,
      eyeOffOutline, logInOutline, personAddOutline, alertCircleOutline,
      atOutline
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      if (role === 'Owner' || role === 'Apoteker') {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/pos-transaksi');
      }
    }
  }

  login() {
    this.errorMsg = '';

    if (!this.username || !this.password) {
      this.errorMsg = 'Username dan password wajib diisi!';
      return;
    }

    this.isLoading = true;

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        if (res.success && res.user) {
          this.authService.setCurrentUser(res.user);

          const toast = await this.toastCtrl.create({
            message: `Selamat datang, ${res.user.nama}! 👋`,
            duration: 2000, color: 'success', position: 'bottom'
          });
          await toast.present();

          if (res.user.role === 'Owner' || res.user.role === 'Apoteker') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/pos-transaksi';
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.error || 'Terjadi kesalahan saat login!';
      }
    });
  }

  async daftar() {
    if (!this.regNama || !this.regUsername || !this.regPassword) {
      const toast = await this.toastCtrl.create({
        message: 'Semua field wajib diisi!',
        duration: 2000, color: 'warning', position: 'bottom'
      });
      await toast.present();
      return;
    }

    this.isRegistering = true;

    this.apiService.register({
      nama_karyawan: this.regNama,
      username: this.regUsername,
      password: this.regPassword
    }).subscribe({
      next: async () => {
        this.isRegistering = false;
        const toast = await this.toastCtrl.create({
          message: '✅ Akun berhasil didaftarkan! Silakan masuk.',
          duration: 2500, color: 'success', position: 'bottom'
        });
        await toast.present();

        this.regNama = '';
        this.regUsername = '';
        this.regPassword = '';
        this.activeTab = 'masuk';
      },
      error: async (err) => {
        this.isRegistering = false;
        const toast = await this.toastCtrl.create({
          message: err.error?.error || 'Gagal mendaftar, coba lagi.',
          duration: 3000, color: 'danger', position: 'bottom'
        });
        await toast.present();
      }
    });
  }
}