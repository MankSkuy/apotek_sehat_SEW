import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Kasir (POS)', url: '/pos-transaksi', icon: 'cart' },
    { title: 'Data Obat', url: '/data-obat', icon: 'medkit' },
    { title: 'Pembelian', url: '/pembelian', icon: 'bag-add' },
    { title: 'Manajemen Batch', url: '/manajemen-batch', icon: 'layers' },
    { title: 'Jurnal Keuangan', url: '/jurnal', icon: 'cash' },
    { title: 'Laporan', url: '/laporan', icon: 'bar-chart' },
    { title: 'Pegawai', url: '/manajemen-karyawan', icon: 'people' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
