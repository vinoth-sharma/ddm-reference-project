import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportCriteriaComp } from './select-report-criteria.component';

describe('SelectReportCriteriaComp', () => {
  let component: SelectReportCriteriaComp;
  let fixture: ComponentFixture<SelectReportCriteriaComp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectReportCriteriaComp ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectReportCriteriaComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
