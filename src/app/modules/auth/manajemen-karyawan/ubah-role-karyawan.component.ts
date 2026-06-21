import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { addIcons } from 'ionicons';
import { closeOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ubah-role-karyawan',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>Ubah Role Karyawan</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="karyawan-info">
        <ion-icon name="shield-checkmark-outline"></ion-icon>
        <div>
          <p class="label">Karyawan</p>
          <p class="nama">{{ karyawan?.nama_karyawan }}</p>
          <p class="username">@{{ karyawan?.username }}</p>
        </div>
      </div>

      <div class="form-group">
        <label>Pilih Role Baru</label>
        <ion-select
          [(ngModel)]="newRole"
          interface="popover"
          fill="outline">
          <ion-select-option value="Karyawan">Karyawan (Akses Terbatas)</ion-select-option>
          <ion-select-option value="Kasir">Kasir (Akses POS & Laporan)</ion-select-option>
          <ion-select-option value="Apoteker">Apoteker (Akses Stok & Obat)</ion-select-option>
          <ion-select-option value="Owner">Owner (Akses Penuh)</ion-select-option>
        </ion-select>
      </div>

      <ion-button
        expand="block"
        color="warning"
        (click)="simpanRole()"
        [disabled]="isSaving">
        <ion-spinner *ngIf="isSaving" name="crescent" slot="start"></ion-spinner>
        {{ isSaving ? 'Menyimpan...' : 'Update Role' }}
      </ion-button>

    </ion-content>
  `,
  styles: [`
    .karyawan-info {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff8ed;
      border: 1px solid #f5c97a;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 20px;
      ion-icon { font-size: 32px; color: var(--ion-color-warning); flex-shrink: 0; }
      .label { font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
      .nama { font-size: 16px; font-weight: 700; color: #28251d; margin: 2px 0; }
      .username { font-size: 13px; color: #7a7974; margin: 0; }
    }
    .form-group {
      margin-bottom: 20px;
      label { display: block; font-weight: 600; font-size: 14px; color: #555; margin-bottom: 6px; }
    }
  `]
})
export class UbahRoleKaryawanComponent implements OnInit {
  @Input() karyawan: any = null;
  newRole: string = 'Karyawan';
  isSaving = false;

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) {
    addIcons({ closeOutline, shieldCheckmarkOutline });
  }

  ngOnInit() {
    if (this.karyawan) this.newRole = this.karyawan.role;
  }

  dismiss(data?: any) { this.modalCtrl.dismiss(data); }

  simpanRole() {
    this.isSaving = true;
    this.apiService.updateKaryawanRole(this.karyawan.id_karyawan, this.newRole).subscribe({
      next: () => {
        this.showToast('✅ Role berhasil diperbarui', 'success');
        this.isSaving = false;
        this.dismiss({ reload: true });
      },
      error: (err: any) => {
        this.showToast('Gagal: ' + (err.error?.error || 'Terjadi kesalahan'), 'danger');
        this.isSaving = false;
      }
    });
  }

  async showToast(msg: string, clr: string) {
    const toast = await this.toastCtrl.create({
      message: msg, color: clr, duration: 3000, position: 'top'
    });
    toast.present();
  }
}