import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PembelianPage } from './pembelian.page';

describe('PembelianPage', () => {
  let component: PembelianPage;
  let fixture: ComponentFixture<PembelianPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PembelianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
