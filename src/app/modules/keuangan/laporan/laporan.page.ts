import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedHeaderComponent } from '../../../components/shared-header/shared-header.component';

interface Transaksi {
  id: string;
  tanggal: string; // format YYYY-MM-DD HH:mm
  itemText: string;
  jumlahItem: number;
  total: number;
}

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, SharedHeaderComponent],
  standalone: true
})
export class LaporanPage implements OnInit {
  periodeAktif: 'hari-ini' | '7-hari' | '30-hari' = 'hari-ini';

  riwayatTransaksi: Transaksi[] = [
    // Today: 2026-06-02
    { id: 'TX-001', tanggal: '2026-06-02 08:30', itemText: 'Paracetamol 500mg (2x), Vitamin C 1000mg (1x)', jumlahItem: 3, total: 18000 },
    { id: 'TX-002', tanggal: '2026-06-02 10:15', itemText: 'Amoxicillin 500mg (3x), Cetirizine 10mg (2x)', jumlahItem: 5, total: 55000 },
    { id: 'TX-003', tanggal: '2026-06-02 14:20', itemText: 'OBH Combi 100ml (1x)', jumlahItem: 1, total: 18000 },
    
    // Last 7 days
    { id: 'TX-004', tanggal: '2026-06-01 11:00', itemText: 'Ibuprofen 400mg (5x)', jumlahItem: 5, total: 30000 },
    { id: 'TX-005', tanggal: '2026-05-30 09:45', itemText: 'Betadine 30ml (2x), Paracetamol 500mg (3x)', jumlahItem: 5, total: 39000 },
    { id: 'TX-006', tanggal: '2026-05-28 16:30', itemText: 'Amoxicillin 500mg (4x)', jumlahItem: 4, total: 60000 },
    { id: 'TX-007', tanggal: '2026-05-27 15:00', itemText: 'Vitamin C 1000mg (5x)', jumlahItem: 5, total: 40000 },
    
    // Last 30 days
    { id: 'TX-008', tanggal: '2026-05-20 10:00', itemText: 'OBH Combi 100ml (2x), Antasida (4x)', jumlahItem: 6, total: 50000 },
    { id: 'TX-009', tanggal: '2026-05-15 11:30', itemText: 'Paracetamol 500mg (10x)', jumlahItem: 10, total: 50000 },
    { id: 'TX-010', tanggal: '2026-05-10 14:00', itemText: 'Amoxicillin 500mg (8x)', jumlahItem: 8, total: 120000 },
    { id: 'TX-011', tanggal: '2026-05-05 17:15', itemText: 'Betadine 30ml (5x)', jumlahItem: 5, total: 60000 }
  ];

  constructor() {}

  ngOnInit() {}

  setPeriode(periode: 'hari-ini' | '7-hari' | '30-hari') {
    this.periodeAktif = periode;
  }

  // Get transactions filtered by selected period
  get transactionsFiltered(): Transaksi[] {
    const today = new Date('2026-06-02'); // Mock today's date from system metadata
    return this.riwayatTransaksi.filter(t => {
      const txDate = new Date(t.tanggal.substring(0, 10));
      const diffTime = today.getTime() - txDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (this.periodeAktif === 'hari-ini') {
        return diffDays <= 1; // today
      } else if (this.periodeAktif === '7-hari') {
        return diffDays <= 7;
      } else if (this.periodeAktif === '30-hari') {
        return diffDays <= 30;
      }
      return true;
    });
  }

  // Statistics calculation for summary cards
  get totalPendapatan(): number {
    return this.transactionsFiltered.reduce((sum, t) => sum + t.total, 0);
  }

  get totalTransaksi(): number {
    return this.transactionsFiltered.length;
  }

  get totalItemTerjual(): number {
    return this.transactionsFiltered.reduce((sum, t) => sum + t.jumlahItem, 0);
  }

  get rataRataPendapatan(): number {
    const total = this.totalPendapatan;
    if (this.periodeAktif === 'hari-ini') {
      return total;
    } else if (this.periodeAktif === '7-hari') {
      return Math.round(total / 7);
    } else {
      return Math.round(total / 30);
    }
  }

  formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }
}
