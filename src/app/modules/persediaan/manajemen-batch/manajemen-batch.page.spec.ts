import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManajemenBatchPage } from './manajemen-batch.page';

describe('ManajemenBatchPage', () => {
  let component: ManajemenBatchPage;
  let fixture: ComponentFixture<ManajemenBatchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManajemenBatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
