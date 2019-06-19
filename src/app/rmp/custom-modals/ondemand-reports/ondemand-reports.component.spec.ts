import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndemandReportsComponent } from './ondemand-reports.component';

describe('OndemandReportsComponent', () => {
  let component: OndemandReportsComponent;
  let fixture: ComponentFixture<OndemandReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndemandReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndemandReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
