import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportCriteriaComponent } from './select-report-criteria.component';

describe('SelectReportCriteriaComponent', () => {
  let component: SelectReportCriteriaComponent;
  let fixture: ComponentFixture<SelectReportCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectReportCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectReportCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
