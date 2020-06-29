import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCriteriaHelpComponent } from './report-criteria-help.component';

describe('ReportCriteriaHelpComponent', () => {
  let component: ReportCriteriaHelpComponent;
  let fixture: ComponentFixture<ReportCriteriaHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCriteriaHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCriteriaHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
