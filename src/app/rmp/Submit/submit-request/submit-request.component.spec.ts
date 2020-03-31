import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { SubmitRequestComponent } from './submit-request.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('SubmitRequestComponent', () => {
  let component: SubmitRequestComponent;
  let fixture: ComponentFixture<SubmitRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitRequestComponent ],
      providers : [ GeneratedReportService ],
      imports : [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
