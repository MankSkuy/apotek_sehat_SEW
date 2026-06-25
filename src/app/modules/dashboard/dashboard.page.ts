import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonIcon, IonButton, IonSpinner, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  walletOutline, receiptOutline, cubeOutline, warningOutline,
  timeOutline, arrowForwardOutline, refreshOutline, checkmarkCircleOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent, IonIcon, IonButton, IonSpinner, IonBadge
  ]
})
export class DashboardPage implements OnInit {
  isLoading = false;

  // KPI Cards
  totalPendapatan = 0;
  totalTransaksi = 0;
  itemTerjual = 0;
  totalItemObat = 0;
  stokMenipis = 0;
  hampirExpired = 0;

  // Warning lists
  stokMenipisList: any[] = [];
  hampirExpiredList: any[] = [];

  // Transaksi terbaru
  transaksiTerbaru: any[] = [];

  constructor(private apiService: ApiService) {
    addIcons({ refreshOutline, walletOutline, receiptOutline, cubeOutline, warningOutline, timeOutline, checkmarkCircleOutline, arrowForwardOutline });
  }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.loadLaporanSummary();
    this.loadBatchSummary();
    this.loadWarnings();
    this.loadTransaksiTerbaru();
  }

  loadLaporanSummary() {
    this.apiService.getLaporanSummary('hari_ini').subscribe({
      next: (data: any) => {
        this.totalPendapatan = data.total_pendapatan;
        this.totalTransaksi = data.total_transaksi;
        this.itemTerjual = data.item_terjual;
      },
      error: () => { }
    });
  }

  loadBatchSummary() {
    this.apiService.getBatchSummary().subscribe({
      next: (data: any) => {
        this.totalItemObat = data.total_item;
        this.stokMenipis = data.stok_menipis;
        this.hampirExpired = data.hampir_expired;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadWarnings() {
    this.apiService.getBatchWarnings().subscribe({
      next: (data: any) => {
        this.stokMenipisList = data.stok_menipis?.slice(0, 5) || [];
        this.hampirExpiredList = data.hampir_expired?.slice(0, 5) || [];
      },
      error: () => { }
    });
  }

  loadTransaksiTerbaru() {
    this.apiService.getLaporanTransaksi('7_hari').subscribe({
      next: (data: any) => {
        this.transaksiTerbaru = data.slice(0, 5);
      },
      error: () => { }
    });
  }

  refresh() {
    this.loadDashboard();
  }

  formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}