import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JurnalPage } from './jurnal.page';

describe('JurnalPage', () => {
  let component: JurnalPage;
  let fixture: ComponentFixture<JurnalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
