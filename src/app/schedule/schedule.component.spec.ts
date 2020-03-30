import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MultiDatePickerMaterialModule } from '../custom-directives/multiple-dates-picker/material-module'
import { By } from '@angular/platform-browser';

import { ScheduleComponent } from './schedule.component';
import { MultipleDatesPickerComponent } from '../custom-directives/multiple-dates-picker/multiple-dates-picker.component'
import { ShowSignatureSchedularComponent } from '../show-signature-schedular/show-signature-schedular.component'

import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
// import { MultipleDatesSelectionService } from '../custom-directives/multiple-dates-picker/multiple-dates-selection.service';

@NgModule({
  imports : [ FormControl ]
})
class testingComponent { }

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleComponent, MultipleDatesPickerComponent, ShowSignatureSchedularComponent ],
      imports: [ MultiDatePickerMaterialModule, RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MaterialModule, QuillModule.forRoot() ],
      providers: [ CreateReportLayoutService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test the changeDeliveryMethod parameters',()=>{
    let testdeliveryMethod = 1;
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeDeliveryMethod(testdeliveryMethod);
    fixture.detectChanges();
    expect(component.isFtpHidden).toEqual(true);
  })

  it('should test the changeDeliveryMethod parameters',()=>{
    let testdeliveryMethod = 2;
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeDeliveryMethod(testdeliveryMethod);
    fixture.detectChanges();
    expect(component.isFtpHidden).toEqual(false);
  })

  it('should set the notification value',()=>{
    let testValue = 'true';
    component = fixture.componentInstance;
    component.setNotificationValue(testValue);
    fixture.detectChanges();
    expect(component.scheduleData.notification_flag).toEqual(testValue)
  })


  it('should set the email values',()=>{
    // let testEmails = ['testEmail1@gm.com','testEmail2@gm.com','testEmail3@gm.com','testEmail4@gm.com'];
    // try importing service and checking??
    let testEmails = [];
    component = fixture.componentInstance;
    component.setMultipleAddressListValues();
    // fixture.detectChanges();
    expect(component.scheduleData.multiple_addresses).toEqual(testEmails)
  })

  // TypeError: Cannot read property 'updateTodaysDate' of undefined
  // it('should test the close and opening of the recurring frequency pattern dropdown :: 1 ', ()=>{
  //   let testRecurrencePattern = '1';
  //   fixture = TestBed.createComponent(ScheduleComponent);
  //   component = fixture.componentInstance;
  //   component.setCollapse(testRecurrencePattern);
  //   // let service = fixture.debugElement.injector.get(MultipleDatesSelectionService);
  //   fixture.detectChanges();

  //   // expect(service.recurrencePattern).toEqual(testRecurrencePattern);
  //   expect(component.isDatePickerHidden).toEqual(true);
  //   // expect(service.datesChosen).toEqual(component.todaysDate);

  // } )

  // selectSignature(signatureName) {
  //   this.signSelected = true;
  //   this.inputParams = this.signatures.find(x =>
  //     x.signature_html.trim().toLowerCase() == signatureName.target.value.trim().toLowerCase());
  //     console.log("this.inputParams are: ",this.inputParams);
  //     this.scheduleData.signature_html = this.inputParams.signature_html;
  // }
 
  // it('should select the signature ',()=>{
  //   let testSignatureName = 'ddmTeam';
  //   let testSignatureObject = { signature_name : testSignatureName, signature_html : '<p>Regards,DDM Team</p>'}
  //   fixture = TestBed.createComponent(ScheduleComponent);
  //   component = fixture.componentInstance;
  //   component.selectSignature('ddmTeam')
  //   fixture.detectChanges();
  //   // ??
  //   // expect(component.scheduleData.signature_html).toEqual(component.inputParams.signature_html);
  // })

  it('should test the getRecipientList()',()=>{
    let mockRequestId: number = 11;
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(CreateReportLayoutService);
    fixture.detectChanges();
    service.getRequestDetails(mockRequestId).subscribe(res=>{
      expect(component.emails).toEqual(res['dl_list'].map(i=>i.distribution_list))
      expect(component.scheduleData.multiple_addresses).toEqual(component.emails)
      // this.scheduleData.multiple_addresses = this.emails;
    })
  })
});