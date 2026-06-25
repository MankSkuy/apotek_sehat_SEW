import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonBadge,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medkitOutline, addCircleOutline, trashOutline, closeOutline, createOutline
} from 'ionicons/icons';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-data-obat',
  templateUrl: './data-obat.page.html',
  styleUrls: ['./data-obat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonList, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonBadge
  ]
})
export class DataObatPage implements OnInit {
  obatList: any[] = [];
  filteredObat: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  showModal: boolean = false;

  newObat: any = {
    nama_obat: '',
    kategori_obat: '',
    satuan: '',
    stok_minimal: 10
  };
  editingObat: any = null;

  constructor(
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ medkitOutline, addCircleOutline, trashOutline, closeOutline, createOutline });
  }

  ngOnInit() {
    this.loadObat();
  }

  loadObat() {
    this.isLoading = true;
    this.apiService.getObat().subscribe({
      next: (data: any) => {
        this.obatList = data;
        this.filteredObat = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast('Gagal memuat data obat: ' + err.message, 'danger');
        this.isLoading = false;
      }
    });
  }

  filterObat() {
    const term = this.searchTerm.toLowerCase();
    this.filteredObat = this.obatList.filter(o =>
      o.nama_obat.toLowerCase().includes(term) ||
      o.kategori_obat.toLowerCase().includes(term)
    );
  }

  openTambahModal() {
    this.editingObat = null;
    this.newObat = { nama_obat: '', kategori_obat: '', satuan: '', stok_minimal: 10 };
    this.showModal = true;
  }

  openEditModal(obat: any) {
    this.editingObat = obat;
    this.newObat = {
      nama_obat: obat.nama_obat,
      kategori_obat: obat.kategori_obat,
      satuan: obat.satuan,
      stok_minimal: obat.stok_minimal
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingObat = null;
  }

  simpanObat() {
    if (!this.newObat.nama_obat || !this.newObat.kategori_obat || !this.newObat.satuan) {
      this.showToast('Nama obat, kategori, dan satuan wajib diisi!', 'warning');
      return;
    }
    this.isSaving = true;

    if (this.editingObat) {
      // Edit mode
      this.apiService.updateObat(this.editingObat.id_obat, this.newObat).subscribe({
        next: () => {
          this.showToast('Data obat berhasil diperbarui!', 'success');
          this.isSaving = false;
          this.closeModal();
          this.loadObat();
        },
        error: (err) => {
          this.showToast('Gagal memperbarui: ' + err.error?.error, 'danger');
          this.isSaving = false;
        }
      });
    } else {
      // Tambah mode
      this.apiService.addObat(this.newObat).subscribe({
        next: () => {
          this.showToast('Obat berhasil ditambahkan!', 'success');
          this.isSaving = false;
          this.closeModal();
          this.loadObat();
        },
        error: (err) => {
          this.showToast('Gagal menyimpan: ' + err.error?.message, 'danger');
          this.isSaving = false;
        }
      });
    }
  }

  async konfirmasiHapus(obat: any) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Yakin ingin menghapus <strong>${obat.nama_obat}</strong>? Obat yang sudah memiliki stok atau riwayat penjualan tidak dapat dihapus.`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { text: 'Hapus', role: 'destructive', handler: () => this.hapusObat(obat.id_obat) }
      ]
    });
    await alert.present();
  }

  hapusObat(id: number) {
    this.apiService.deleteObat(id).subscribe({
      next: () => {
        this.showToast('Obat berhasil dihapus.', 'success');
        this.loadObat();
      },
      error: (err) => {
        this.showToast(err.error?.error || 'Gagal menghapus obat.', 'danger');
      }
    });
  }

  getCategoryColor(kategori: string): string {
    const map: any = {
      'Obat Bebas': 'success',
      'Obat Keras': 'danger',
      'Alkes': 'tertiary',
      'Suplemen': 'warning'
    };
    return map[kategori] || 'medium';
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message, color, duration: 3000, position: 'bottom'
    });
    await toast.present();
  }
}