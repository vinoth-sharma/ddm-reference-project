import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportLayoutComponent } from './create-report-layout.component';

describe('CreateReportLayoutComponent', () => {
  let component: CreateReportLayoutComponent;
  let fixture: ComponentFixture<CreateReportLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReportLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
