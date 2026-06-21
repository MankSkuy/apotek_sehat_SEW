import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LaporanPage implements OnInit, AfterViewInit {

  periode: string = 'hari_ini';
  
  summary: any = {
    total_pendapatan: 0,
    total_transaksi: 0,
    item_terjual: 0
  };

  transactions: any[] = [];
  bukuBesar: any[] = [];
  chartData: any[] = [];
  
  chart: any;
  isSyncing: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  get periodeText(): string {
    switch (this.periode) {
      case 'hari_ini': return 'Hari Ini';
      case '7_hari': return '7 Hari Terakhir';
      case '30_hari': return '30 Hari Terakhir';
      default: return '';
    }
  }

  loadData() {
    this.apiService.getLaporanSummary(this.periode).subscribe({
      next: (res) => {
        this.summary = res;
      },
      error: (err) => console.error(err)
    });

    this.apiService.getLaporanTransaksi(this.periode).subscribe({
      next: (res) => this.transactions = res,
      error: (err) => console.error(err)
    });

    this.apiService.getBukuBesar(this.periode).subscribe({
      next: (res) => this.bukuBesar = res,
      error: (err) => console.error(err)
    });

    this.apiService.getLaporanChart(this.periode).subscribe({
      next: (res) => {
        this.chartData = res;
        this.updateChart();
      },
      error: (err) => console.error(err)
    });
  }

  renderChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Pendapatan Penjualan (Rp)',
          data: [],
          borderColor: '#1a73e8',
          backgroundColor: 'rgba(26, 115, 232, 0.5)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return 'Rp ' + value.toLocaleString('id-ID');
              }
            }
          }
        }
      }
    });

    this.updateChart();
  }

  updateChart() {
    if (!this.chart) return;
    
    let labels: string[] = [];
    let data: number[] = [];

    if (this.periode === 'hari_ini') {
      // Buat 24 jam label
      for (let i = 0; i < 24; i++) {
        const hourLabel = i.toString().padStart(2, '0') + ':00';
        labels.push(hourLabel);
        
        // Cari apakah ada data untuk jam ini
        const match = this.chartData.find(d => {
          const dDate = new Date(d.tanggal);
          return dDate.getHours() === i;
        });
        
        data.push(match ? parseFloat(match.total_pendapatan) : 0);
      }
    } else {
      // Proses normal untuk 7 hari atau 30 hari
      labels = this.chartData.map(d => {
        const date = new Date(d.tanggal);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      });
      data = this.chartData.map(d => parseFloat(d.total_pendapatan));
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  syncGoogleSheets() {
    this.isSyncing = true;
    this.apiService.syncGoogleSheets().subscribe({
      next: async (res) => {
        this.isSyncing = false;
        const toast = await this.toastCtrl.create({
          message: res.message || 'Berhasil sinkronisasi ke Google Sheets',
          color: 'success',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      },
      error: async (err) => {
        this.isSyncing = false;
        const toast = await this.toastCtrl.create({
          message: err.error?.error || 'Gagal sinkronisasi ke Google Sheets',
          color: 'danger',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }
}
