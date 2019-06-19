import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndemandConfigReportsComponent } from './ondemand-config-reports.component';

describe('OndemandConfigReportsComponent', () => {
  let component: OndemandConfigReportsComponent;
  let fixture: ComponentFixture<OndemandConfigReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndemandConfigReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
