import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManajemenKaryawanPage } from './manajemen-karyawan.page';

describe('ManajemenKaryawanPage', () => {
  let component: ManajemenKaryawanPage;
  let fixture: ComponentFixture<ManajemenKaryawanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManajemenKaryawanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
