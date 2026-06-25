import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-manajemen-batch',
  templateUrl: './manajemen-batch.page.html',
  styleUrls: ['./manajemen-batch.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class ManajemenBatchPage implements OnInit {
  
  batches: any[] = [];
  filteredBatches: any[] = [];
  
  obatList: any[] = [];
  
  summary: any = {
    total_item: 0,
    stok_menipis: 0,
    estimasi_nilai: 0,
    hampir_expired: 0
  };

  warningCount = 0;
  stokMenipisList: any[] = [];
  hampirExpiredList: any[] = [];

  searchTerm: string = '';
  statusFilter: string = 'Semua Status';

  // Modal
  isModalOpen = false;
  isSaving = false;
  newBatchItems: any[] = [];

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Get batches
    this.apiService.getBatchObat().subscribe({
      next: (res) => {
        this.batches = res;
        this.filterData();
      },
      error: (err) => console.error(err)
    });

    // 2. Get warnings
    this.apiService.getBatchWarnings().subscribe({
      next: (res) => {
        this.warningCount = res.total_warnings;
        this.stokMenipisList = res.stok_menipis;
        this.hampirExpiredList = res.hampir_expired;
      },
      error: (err) => console.error(err)
    });

    // 3. Get summary
    this.apiService.getBatchSummary().subscribe({
      next: (res) => {
        this.summary = res;
      },
      error: (err) => console.error(err)
    });

    // 4. Get obat list for modal
    this.apiService.getObat().subscribe({
      next: (res) => {
        this.obatList = res;
      },
      error: (err) => console.error(err)
    });
  }

  filterData() {
    let temp = this.batches;

    // Search filter
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(b => 
        b.nama_obat.toLowerCase().includes(term) || 
        b.kategori_obat.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (this.statusFilter !== 'Semua Status') {
      temp = temp.filter(b => this.getStatusText(b) === this.statusFilter);
    }

    this.filteredBatches = temp;
  }

  filterByObat(namaObat: string) {
    this.searchTerm = namaObat;
    this.statusFilter = 'Semua Status';
    this.filterData();
  }

  getStatusText(batch: any): string {
    if (batch.sisa_hari <= 30) {
      return 'Hampir Expired';
    } else if (batch.jumlah_stok <= batch.stok_minimal) {
      return 'Stok Rendah';
    }
    return 'Aman';
  }

  getBadgeClass(batch: any): string {
    const status = this.getStatusText(batch);
    if (status === 'Hampir Expired') return 'badge-expired';
    if (status === 'Stok Rendah') return 'badge-rendah';
    return 'badge-aman';
  }

  // ===== BATCH BARU MODAL =====
  openBatchModal() {
    this.newBatchItems = [
      { id_obat: null, jumlah_stok: null, tanggal_expired: null, harga_beli: null, harga_jual: null }
    ];
    this.isModalOpen = true;
  }

  tambahItemBatch() {
    this.newBatchItems.push({ id_obat: null, jumlah_stok: null, tanggal_expired: null, harga_beli: null, harga_jual: null });
  }

  hapusItemBatch(index: number) {
    this.newBatchItems.splice(index, 1);
  }

  simpanBatch() {
    // Validate
    for (let i = 0; i < this.newBatchItems.length; i++) {
      const item = this.newBatchItems[i];
      if (!item.id_obat || !item.jumlah_stok || !item.tanggal_expired || !item.harga_beli || !item.harga_jual) {
        this.showToast(`Mohon lengkapi data Obat #${i + 1}`, 'warning');
        return;
      }
    }

    this.isSaving = true;
    this.apiService.addBatchObat({ items: this.newBatchItems }).subscribe({
      next: () => {
        this.isSaving = false;
        this.isModalOpen = false;
        this.showToast('Batch obat berhasil ditambahkan!', 'success');
        this.loadData(); // Refresh data
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast(err.error?.error || 'Gagal menyimpan batch!', 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: color,
      duration: 2500,
      position: 'bottom'
    });
    toast.present();
  }
}
