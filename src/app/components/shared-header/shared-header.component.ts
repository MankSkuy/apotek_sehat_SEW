import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SharedHeaderComponent {
  @Input() activeTab: string = 'penjualan';
  @Input() showWarning: boolean = true;

  warningDismissed: boolean = false;

  tabs = [
    { id: 'penjualan', label: 'Penjualan', icon: 'receipt-outline', route: '/pos-transaksi' },
    { id: 'stok-obat', label: 'Stok Obat', icon: 'medical-outline', route: '/manajemen-batch' },
    { id: 'laporan', label: 'Laporan Keuangan', icon: 'trending-up-outline', route: '/laporan' }
  ];

  warningItems = {
    stokMenipis: [
      { nama: 'Ibuprofen 400mg', detail: 'Tersisa 15 unit | Stok: 15' }
    ],
    kadaluarsa: [
      { nama: 'Amoxicillin 500mg', detail: 'Kadaluarsa dalam 14 hari (15/6/2026)' }
    ]
  };

  constructor(private router: Router) {}

  get totalWarnings(): number {
    return this.warningItems.stokMenipis.length + this.warningItems.kadaluarsa.length;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  dismissWarning() {
    this.warningDismissed = true;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
