import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportConditionsComponent } from './report-conditions.component';

describe('ReportConditionsComponent', () => {
  let component: ReportConditionsComponent;
  let fixture: ComponentFixture<ReportConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
