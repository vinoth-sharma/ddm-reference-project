import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByExcelComponent } from './by-excel.component';

describe('ByExcelComponent', () => {
  let component: ByExcelComponent;
  let fixture: ComponentFixture<ByExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
