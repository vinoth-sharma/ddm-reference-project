import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedColumnReportComponent } from './calculated-column-report.component';

describe('CalculatedColumnReportComponent', () => {
  let component: CalculatedColumnReportComponent;
  let fixture: ComponentFixture<CalculatedColumnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatedColumnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedColumnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
