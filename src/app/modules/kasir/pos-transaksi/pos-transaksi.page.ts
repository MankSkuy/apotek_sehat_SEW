import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedHeaderComponent } from '../../../components/shared-header/shared-header.component';

interface Obat {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
}

interface CartItem {
  obat: Obat;
  qty: number;
}

@Component({
  selector: 'app-pos-transaksi',
  templateUrl: './pos-transaksi.page.html',
  styleUrls: ['./pos-transaksi.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, SharedHeaderComponent],
  standalone: true
})
export class PosTransaksiPage implements OnInit {
  searchQuery: string = '';
  cart: CartItem[] = [];
  showSuccessToast: boolean = false;

  daftarObat: Obat[] = [
    { id: 1, nama: 'Paracetamol 500mg', harga: 5000, stok: 150, kategori: 'Analgesik' },
    { id: 2, nama: 'Amoxicillin 500mg', harga: 15000, stok: 80, kategori: 'Antibiotik' },
    { id: 3, nama: 'Vitamin C 1000mg', harga: 8000, stok: 200, kategori: 'Vitamin' },
    { id: 4, nama: 'Antasida', harga: 3500, stok: 120, kategori: 'Pencernaan' },
    { id: 5, nama: 'OBH Combi', harga: 18000, stok: 60, kategori: 'Batuk & Flu' },
    { id: 6, nama: 'Betadine 30ml', harga: 12000, stok: 45, kategori: 'Antiseptik' },
  ];

  constructor() {}

  ngOnInit() {}

  get filteredObat(): Obat[] {
    if (!this.searchQuery.trim()) return this.daftarObat;
    const q = this.searchQuery.toLowerCase();
    return this.daftarObat.filter(o =>
      o.nama.toLowerCase().includes(q) || o.kategori.toLowerCase().includes(q)
    );
  }

  get totalBayar(): number {
    return this.cart.reduce((sum, item) => sum + (item.obat.harga * item.qty), 0);
  }

  formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  addToCart(obat: Obat) {
    const existing = this.cart.find(c => c.obat.id === obat.id);
    if (existing) {
      if (existing.qty < obat.stok) {
        existing.qty++;
      }
    } else {
      this.cart.push({ obat, qty: 1 });
    }
  }

  increaseQty(item: CartItem) {
    if (item.qty < item.obat.stok) {
      item.qty++;
    }
  }

  decreaseQty(item: CartItem) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(c => c.obat.id !== item.obat.id);
  }

  selesaikanTransaksi() {
    if (this.cart.length === 0) return;

    // Reduce stock
    this.cart.forEach(item => {
      const obat = this.daftarObat.find(o => o.id === item.obat.id);
      if (obat) {
        obat.stok -= item.qty;
      }
    });

    this.cart = [];
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }
}
