import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataObatPage } from './data-obat.page';

describe('DataObatPage', () => {
  let component: DataObatPage;
  let fixture: ComponentFixture<DataObatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
