import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tambah-edit-karyawan',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="form-group">
        <label>Nama Karyawan <span class="required">*</span></label>
        <ion-input
          [(ngModel)]="form.nama_karyawan"
          placeholder="Masukkan nama lengkap"
          fill="outline"
          [class.input-error]="submitted && !form.nama_karyawan">
        </ion-input>
        <span class="error-hint" *ngIf="submitted && !form.nama_karyawan">Nama wajib diisi</span>
      </div>

      <div class="form-group">
        <label>Username <span class="required">*</span></label>
        <ion-input
          [(ngModel)]="form.username"
          placeholder="Masukkan username login"
          fill="outline"
          [class.input-error]="submitted && !form.username">
        </ion-input>
        <span class="error-hint" *ngIf="submitted && !form.username">Username wajib diisi</span>
      </div>

      <div class="form-group" *ngIf="!editingKaryawan">
        <label>Password <span class="required">*</span></label>
        <ion-input
          type="password"
          [(ngModel)]="form.password"
          placeholder="Masukkan password"
          fill="outline"
          [class.input-error]="submitted && !form.password">
        </ion-input>
        <span class="error-hint" *ngIf="submitted && !form.password">Password wajib diisi</span>
      </div>

      <div class="form-group" *ngIf="!editingKaryawan">
        <label>Role</label>
        <ion-select
          [(ngModel)]="form.role"
          interface="popover"
          fill="outline">
          <ion-select-option value="Karyawan">Karyawan</ion-select-option>
          <ion-select-option value="Kasir">Kasir</ion-select-option>
          <ion-select-option value="Apoteker">Apoteker</ion-select-option>
          <ion-select-option value="Owner">Owner</ion-select-option>
        </ion-select>
      </div>

      <ion-button
        expand="block"
        color="primary"
        class="ion-margin-top"
        (click)="simpan()"
        [disabled]="isSaving">
        <ion-spinner *ngIf="isSaving" name="crescent" slot="start"></ion-spinner>
        {{ isSaving ? 'Menyimpan...' : (editingKaryawan ? 'Update Karyawan' : 'Simpan Karyawan') }}
      </ion-button>

    </ion-content>
  `,
  styles: [`
    .form-group { margin-bottom: 16px; }
    label {
      display: block;
      font-weight: 600;
      font-size: 14px;
      color: #555;
      margin-bottom: 6px;
    }
    .required { color: var(--ion-color-danger); }
    .error-hint {
      font-size: 12px;
      color: var(--ion-color-danger);
      margin-top: 4px;
      display: block;
    }
    .input-error { --border-color: var(--ion-color-danger); }
  `]
})
export class TambahEditKaryawanComponent implements OnInit {
  @Input() editingKaryawan: any = null;

  form: any = {
    nama_karyawan: '',
    username: '',
    password: '',
    role: 'Karyawan'
  };

  isSaving = false;
  submitted = false;

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    if (this.editingKaryawan) {
      this.form = {
        nama_karyawan: this.editingKaryawan.nama_karyawan,
        username: this.editingKaryawan.username
      };
    }
  }

  dismiss(data?: any) { this.modalCtrl.dismiss(data); }

  simpan() {
    this.submitted = true;
    if (!this.form.nama_karyawan || !this.form.username) {
      this.showToast('Nama dan username wajib diisi!', 'warning');
      return;
    }
    if (!this.editingKaryawan && !this.form.password) {
      this.showToast('Password wajib diisi untuk karyawan baru!', 'warning');
      return;
    }
    this.isSaving = true;
    const request$ = this.editingKaryawan
      ? this.apiService.updateKaryawan(this.editingKaryawan.id_karyawan, this.form)
      : this.apiService.addKaryawan(this.form);
    request$.subscribe({
      next: () => {
        this.showToast(
          this.editingKaryawan ? '✅ Karyawan berhasil diperbarui' : '✅ Karyawan berhasil ditambahkan',
          'success'
        );
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