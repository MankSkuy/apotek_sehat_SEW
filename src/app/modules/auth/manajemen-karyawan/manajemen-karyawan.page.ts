import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController, ModalController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TambahEditKaryawanComponent } from './tambah-edit-karyawan.component';
import { UbahRoleKaryawanComponent } from './ubah-role-karyawan.component';
import { addIcons } from 'ionicons';
import { peopleOutline, addCircleOutline, createOutline, trashOutline, shieldCheckmarkOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-manajemen-karyawan',
  templateUrl: './manajemen-karyawan.page.html',
  styleUrls: ['./manajemen-karyawan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ManajemenKaryawanPage implements OnInit {

  karyawanList: any[] = [];
  isOwner: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    addIcons({ peopleOutline, addCircleOutline, createOutline, trashOutline, shieldCheckmarkOutline, closeOutline });
  }

  ngOnInit() {
    this.isOwner = this.authService.isOwner();
    this.loadKaryawan();
  }

  loadKaryawan() {
    this.apiService.getKaryawan().subscribe({
      next: (res) => { this.karyawanList = res; },
      error: (err) => console.error('Load karyawan error:', err)
    });
  }

  getRoleColor(role: string): string {
    switch(role) {
      case 'Owner':    return 'primary';
      case 'Apoteker': return 'success';
      case 'Kasir':    return 'warning';
      default:         return 'medium';
    }
  }

  async openTambahModal() {
    const modal = await this.modalCtrl.create({
      component: TambahEditKaryawanComponent,
      componentProps: { editingKaryawan: null },
      cssClass: 'modal-card-center',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.reload) this.loadKaryawan();
  }

  async openEditModal(karyawan: any) {
    const modal = await this.modalCtrl.create({
      component: TambahEditKaryawanComponent,
      componentProps: { editingKaryawan: karyawan },
      cssClass: 'modal-card-center',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.reload) this.loadKaryawan();
  }

  async openRoleModal(karyawan: any) {
    const modal = await this.modalCtrl.create({
      component: UbahRoleKaryawanComponent,
      componentProps: { karyawan },
      cssClass: 'modal-card-center modal-card-sm',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.reload) this.loadKaryawan();
  }

  async konfirmasiHapus(karyawan: any) {
    if (karyawan.id_karyawan === this.authService.getUserId()) {
      this.showToast('Anda tidak dapat menghapus akun Anda sendiri.', 'danger');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus karyawan <strong>${karyawan.nama_karyawan}</strong>?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.apiService.deleteKaryawan(karyawan.id_karyawan).subscribe({
              next: () => {
                this.showToast('✅ Karyawan berhasil dihapus', 'success');
                this.loadKaryawan();
              },
              error: (err) => {
                this.showToast('Gagal menghapus: ' + (err.error?.error || 'Terjadi kesalahan'), 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(msg: string, clr: string) {
    const toast = await this.toastCtrl.create({
      message: msg, color: clr, duration: 3000, position: 'top'
    });
    toast.present();
  }
}