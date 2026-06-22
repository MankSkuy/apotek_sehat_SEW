import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pos-transaksi',
  templateUrl: './pos-transaksi.page.html',
  styleUrls: ['./pos-transaksi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PosTransaksiPage implements OnInit {
  
  obatList: any[] = [];
  filteredObat: any[] = [];
  
  searchTerm = '';
  selectedCategory = 'Semua';

  cart: any[] = [];
  uangTunai: number = 0;
  isProcessing = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadObat();
  }

  loadObat() {
    // Load batch obat to get stock for POS
    // We'll aggregate available stock per obat
    this.apiService.getBatchObat().subscribe({
      next: (batches: any[]) => {
        const obatMap = new Map();
        
        batches.forEach(b => {
          // Only show non-expired batches
          if (b.sisa_hari > 0 && b.jumlah_stok > 0) {
            if (!obatMap.has(b.id_obat)) {
              obatMap.set(b.id_obat, {
                id_obat: b.id_obat,
                nama_obat: b.nama_obat,
                kategori_obat: b.kategori_obat,
                harga_jual: b.harga_jual,
                jumlah_stok: 0,
                satuan: b.satuan,
                resep: b.kategori_obat === 'Obat Keras'
              });
            }
            const o = obatMap.get(b.id_obat);
            o.jumlah_stok += b.jumlah_stok;
            // Store highest price just in case
            if (b.harga_jual > o.harga_jual) o.harga_jual = b.harga_jual; 
          }
        });

        this.obatList = Array.from(obatMap.values());
        this.filterObat();
      },
      error: (err) => console.error(err)
    });
  }

  filterObat() {
    let temp = this.obatList;

    if (this.selectedCategory !== 'Semua') {
      temp = temp.filter(o => o.kategori_obat === this.selectedCategory);
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(o => o.nama_obat.toLowerCase().includes(term));
    }

    this.filteredObat = temp;
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterObat();
  }

  // ===== CART LOGIC =====
  addToCart(item: any) {
    if (item.jumlah_stok <= 0) {
      this.showToast('Stok habis!', 'warning');
      return;
    }

    const existing = this.cart.find(c => c.id_obat === item.id_obat);
    if (existing) {
      if (existing.qty < item.jumlah_stok) {
        existing.qty++;
        existing.subtotal = existing.qty * existing.harga_jual;
      } else {
        this.showToast('Maksimal stok tercapai!', 'warning');
      }
    } else {
      this.cart.push({
        id_obat: item.id_obat,
        nama_obat: item.nama_obat,
        harga_jual: item.harga_jual,
        qty: 1,
        subtotal: item.harga_jual,
        max_stok: item.jumlah_stok
      });
    }
  }

  increaseQty(index: number) {
    const item = this.cart[index];
    if (item.qty < item.max_stok) {
      item.qty++;
      item.subtotal = item.qty * item.harga_jual;
    } else {
      this.showToast('Maksimal stok tercapai!', 'warning');
    }
  }

  decreaseQty(index: number) {
    const item = this.cart[index];
    if (item.qty > 1) {
      item.qty--;
      item.subtotal = item.qty * item.harga_jual;
    } else {
      this.removeFromCart(index);
    }
  }

  updateSubtotal(index: number) {
    const item = this.cart[index];
    if (item.qty > item.max_stok) {
      item.qty = item.max_stok;
      this.showToast('Stok tidak cukup, disesuaikan ke maksimal', 'warning');
    } else if (item.qty < 1) {
      item.qty = 1;
    }
    item.subtotal = item.qty * item.harga_jual;
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  clearCart() {
    this.cart = [];
    this.uangTunai = 0;
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // ===== CHECKOUT =====
  checkout() {
    if (this.cart.length === 0) return;
    const total = this.getTotalPrice();
    if (this.uangTunai < total) {
      this.showToast('Uang tunai kurang!', 'danger');
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    const payload = {
      id_karyawan: currentUser ? currentUser.id_karyawan : null,
      total_belanja: total,
      items: this.cart.map(c => ({
        id_obat: c.id_obat,
        qty: c.qty,
        subtotal: c.subtotal,
        harga_jual: c.harga_jual
      }))
    };

    this.isProcessing = true;
    this.apiService.createPenjualan(payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.showToast('Transaksi berhasil!', 'success');
        this.clearCart();
        this.loadObat(); // Refresh stock
      },
      error: (err) => {
        this.isProcessing = false;
        this.showToast(err.error?.error || 'Transaksi gagal', 'danger');
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