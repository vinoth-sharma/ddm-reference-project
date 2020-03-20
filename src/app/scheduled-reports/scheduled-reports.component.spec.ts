import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from "../material.module";
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
// import { NgModule } from '@angular/core';
// import { NgDatepickerModule } from 'ng2-datepicker';

import { ScheduledReportsComponent } from './scheduled-reports.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { ShowSignatureSchedularComponent } from '../show-signature-schedular/show-signature-schedular.component'
import { MultiDatePicker } from '../multi-date-picker/multi-date-picker';
// import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

describe('ScheduledReportsComponent', () => {
  let component: ScheduledReportsComponent;
  let fixture: ComponentFixture<ScheduledReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledReportsComponent,ScheduleComponent,MultiDatePicker,ShowSignatureSchedularComponent ],
      imports: [FormsModule, ReactiveFormsModule, BrowserModule, MaterialModule.forRoot()],
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
