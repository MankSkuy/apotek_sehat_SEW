import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { SharedHeaderComponent } from '../../../components/shared-header/shared-header.component';

interface ObatStok {
  id: number;
  nama: string;
  kategori: string;
  stok: number;
  hargaBeli: number;
  hargaJual: number;
  kadaluarsa: string;
  resepDokter: boolean;
}

interface BatchItemInput {
  obatId: number | 'baru' | null;
  namaBaru: string;
  kategori: string;
  stok: number;
  hargaBeli: number;
  hargaJual: number;
  kadaluarsa: string;
  resepDokter: boolean;
}

@Component({
  selector: 'app-manajemen-batch',
  templateUrl: './manajemen-batch.page.html',
  styleUrls: ['./manajemen-batch.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, SharedHeaderComponent],
  standalone: true
})
export class ManajemenBatchPage implements OnInit {
  isModalOpen: boolean = false;
  showSuccessToast: boolean = false;
  toastMessage: string = '';
  searchQuery: string = '';
  filterStatus: string = 'semua';

  daftarObat: ObatStok[] = [
    { id: 1, nama: 'Paracetamol 500mg', kategori: 'Analgesik', stok: 150, hargaBeli: 3500, hargaJual: 5000, kadaluarsa: '2028-12-31', resepDokter: false },
    { id: 2, nama: 'Amoxicillin 500mg', kategori: 'Antibiotik', stok: 80, hargaBeli: 11000, hargaJual: 15000, kadaluarsa: '2026-06-15', resepDokter: true },
    { id: 3, nama: 'Ibuprofen 400mg', kategori: 'Analgesik', stok: 15, hargaBeli: 4200, hargaJual: 6000, kadaluarsa: '2027-08-20', resepDokter: false },
    { id: 4, nama: 'Vitamin C 1000mg', kategori: 'Vitamin', stok: 200, hargaBeli: 5800, hargaJual: 8000, kadaluarsa: '2028-03-20', resepDokter: false },
    { id: 5, nama: 'Antasida', kategori: 'Pencernaan', stok: 120, hargaBeli: 2400, hargaJual: 3500, kadaluarsa: '2027-10-10', resepDokter: false },
    { id: 6, nama: 'OBH Combi 100ml', kategori: 'Batuk & Flu', stok: 60, hargaBeli: 13500, hargaJual: 18000, kadaluarsa: '2026-07-10', resepDokter: false },
    { id: 7, nama: 'Betadine 30ml', kategori: 'Antiseptik', stok: 45, hargaBeli: 9200, hargaJual: 12000, kadaluarsa: '2028-05-15', resepDokter: false },
    { id: 8, nama: 'Cetirizine 10mg', kategori: 'Antihistamin', stok: 8, hargaBeli: 3000, hargaJual: 5000, kadaluarsa: '2026-06-12', resepDokter: true }
  ];

  kategoriList: string[] = [
    'Analgesik', 'Antibiotik', 'Vitamin', 'Pencernaan', 'Batuk & Flu', 'Antiseptik', 'Antihistamin', 'Lainnya'
  ];

  batchItems: BatchItemInput[] = [];

  constructor() {}

  ngOnInit() {}

  // Filtered medicines in stock table
  get filteredObat(): ObatStok[] {
    let result = this.daftarObat;

    // Search Query filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o => 
        o.nama.toLowerCase().includes(q) || o.kategori.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (this.filterStatus !== 'semua') {
      result = result.filter(o => {
        const sisaHari = this.getSisaHari(o.kadaluarsa);
        if (this.filterStatus === 'stok-rendah') {
          return o.stok <= 15;
        } else if (this.filterStatus === 'hampir-kadaluarsa') {
          return sisaHari > 0 && sisaHari <= 30;
        } else if (this.filterStatus === 'aman') {
          return o.stok > 15 && sisaHari > 30;
        }
        return true;
      });
    }

    return result;
  }

  // Calculations for stats
  get totalItemsCount(): number {
    return this.daftarObat.length;
  }

  get lowStockCount(): number {
    return this.daftarObat.filter(o => o.stok <= 15).length;
  }

  get totalStockValue(): number {
    return this.daftarObat.reduce((sum, o) => sum + (o.stok * o.hargaBeli), 0);
  }

  get nearExpiryCount(): number {
    return this.daftarObat.filter(o => {
      const sisa = this.getSisaHari(o.kadaluarsa);
      return sisa > 0 && sisa <= 30;
    }).length;
  }

  // Date utility
  getSisaHari(kadaluarsaStr: string): number {
    if (!kadaluarsaStr) return 999;
    const expDate = new Date(kadaluarsaStr);
    const today = new Date('2026-06-02'); // Mock current date from system metadata
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusClass(obat: ObatStok): string {
    const sisa = this.getSisaHari(obat.kadaluarsa);
    if (sisa <= 0) return 'expired';
    if (sisa <= 30) return 'near-expiry';
    if (obat.stok <= 15) return 'low-stock';
    return 'safe';
  }

  getStatusLabel(obat: ObatStok): string {
    const sisa = this.getSisaHari(obat.kadaluarsa);
    if (sisa <= 0) return 'Kadaluarsa';
    if (sisa <= 30) return 'Hampir Expired';
    if (obat.stok <= 15) return 'Stok Rendah';
    return 'Aman';
  }

  formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  // Restock single item directly
  restockSingle(obat: ObatStok) {
    obat.stok += 50;
    this.triggerToast(`Stok ${obat.nama} berhasil ditambah 50 unit!`);
  }

  // Modal logic
  openBatchModal() {
    this.batchItems = [this.createEmptyBatchItem()];
    this.isModalOpen = true;
  }

  closeBatchModal() {
    this.isModalOpen = false;
  }

  createEmptyBatchItem(): BatchItemInput {
    return {
      obatId: null,
      namaBaru: '',
      kategori: 'Analgesik',
      stok: 50,
      hargaBeli: 0,
      hargaJual: 0,
      kadaluarsa: '',
      resepDokter: false
    };
  }

  addBatchItem() {
    this.batchItems.push(this.createEmptyBatchItem());
  }

  removeBatchItem(index: number) {
    this.batchItems.splice(index, 1);
    if (this.batchItems.length === 0) {
      this.addBatchItem();
    }
  }

  onObatSelect(item: BatchItemInput) {
    if (item.obatId && item.obatId !== 'baru') {
      const selected = this.daftarObat.find(o => o.id === item.obatId);
      if (selected) {
        item.kategori = selected.kategori;
        item.hargaBeli = selected.hargaBeli;
        item.hargaJual = selected.hargaJual;
        item.resepDokter = selected.resepDokter;
      }
    } else if (item.obatId === 'baru') {
      item.namaBaru = '';
      item.hargaBeli = 0;
      item.hargaJual = 0;
    }
  }

  saveBatch() {
    // Validation
    const invalidItem = this.batchItems.find(item => {
      if (item.obatId === null) return true;
      if (item.obatId === 'baru' && !item.namaBaru.trim()) return true;
      if (item.stok <= 0) return true;
      if (item.hargaBeli <= 0 || item.hargaJual <= 0) return true;
      if (!item.kadaluarsa) return true;
      return false;
    });

    if (invalidItem) {
      alert('Mohon lengkapi semua input data obat dalam batch secara valid!');
      return;
    }

    let addedCount = 0;
    let updatedCount = 0;

    this.batchItems.forEach(item => {
      if (item.obatId === 'baru') {
        const nextId = this.daftarObat.length > 0 ? Math.max(...this.daftarObat.map(o => o.id)) + 1 : 1;
        this.daftarObat.push({
          id: nextId,
          nama: item.namaBaru,
          kategori: item.kategori,
          stok: item.stok,
          hargaBeli: item.hargaBeli,
          hargaJual: item.hargaJual,
          kadaluarsa: item.kadaluarsa,
          resepDokter: item.resepDokter
        });
        addedCount++;
      } else {
        const existing = this.daftarObat.find(o => o.id === item.obatId);
        if (existing) {
          existing.stok += item.stok;
          existing.hargaBeli = item.hargaBeli;
          existing.hargaJual = item.hargaJual;
          existing.kadaluarsa = item.kadaluarsa;
          existing.resepDokter = item.resepDokter;
          updatedCount++;
        }
      }
    });

    this.closeBatchModal();
    const msg = `Berhasil menyimpan batch! ${addedCount} obat baru ditambahkan, ${updatedCount} stok obat diperbarui.`;
    this.triggerToast(msg);
  }

  triggerToast(message: string) {
    this.toastMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 4000);
  }
}
