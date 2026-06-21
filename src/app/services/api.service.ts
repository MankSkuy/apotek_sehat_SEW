import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ================= AUTH =================
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(data: { nama_karyawan: string; username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  // ================= OBAT =================
  getObat(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obat`);
  }

  addObat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/obat`, data);
  }

  updateObat(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/obat/${id}`, data);
  }

  deleteObat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/obat/${id}`);
  }

  // ================= BATCH =================
  getBatchObat(): Observable<any> {
    return this.http.get(`${this.apiUrl}/batch-obat`);
  }

  getBatchWarnings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/batch-obat/warnings`);
  }

  getBatchSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/batch-obat/summary`);
  }

  addBatchObat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch-obat`, data);
  }

  // ================= PENJUALAN =================
  getPenjualan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/penjualan`);
  }

  createPenjualan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/penjualan`, data);
  }

  // ================= LAPORAN =================
  getLaporanSummary(periode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/laporan/summary?periode=${periode}`);
  }

  getLaporanTransaksi(periode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/laporan/transaksi?periode=${periode}`);
  }

  getLaporanChart(periode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/laporan/chart?periode=${periode}`);
  }

  getBukuBesar(periode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/laporan/buku-besar?periode=${periode}`);
  }

  syncGoogleSheets(): Observable<any> {
    return this.http.post(`${this.apiUrl}/laporan/sync-sheets`, {});
  }

  // ================= KARYAWAN =================
  getKaryawan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/karyawan`);
  }

  addKaryawan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/karyawan`, data);
  }

  updateKaryawan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/karyawan/${id}`, data);
  }

  updateKaryawanRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/karyawan/${id}/role`, { role });
  }

  deleteKaryawan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/karyawan/${id}`);
  }
}