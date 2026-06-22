import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosTransaksiPage } from './pos-transaksi.page';

describe('PosTransaksiPage', () => {
  let component: PosTransaksiPage;
  let fixture: ComponentFixture<PosTransaksiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTransaksiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
