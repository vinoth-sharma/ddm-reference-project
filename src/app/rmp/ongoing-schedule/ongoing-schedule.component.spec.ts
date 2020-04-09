import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { QuillModule } from 'ngx-quill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MultiDatePickerMaterialModule } from '../../custom-directives/multiple-dates-picker/material-module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OngoingScheduleComponent } from './ongoing-schedule.component';
import { ShowSignatureSchedularComponent } from '../../show-signature-schedular/show-signature-schedular.component'
import { MultiDatePickerOngoingComponent } from '../multi-date-picker-ongoing/multi-date-picker-ongoing.component'

import { CreateReportLayoutService } from '../../create-report/create-report-layout/create-report-layout.service';
import { MultiDatePickerOngoingService } from '../multi-date-picker-ongoing/multi-date-picker-ongoing.service';
import { ScheduleService } from 'src/app/schedule/schedule.service';

//// Angular test cases developed by DEEPAK URS G V

describe('OngoingScheduleComponent', () => {
  let component: OngoingScheduleComponent;
  let fixture: ComponentFixture<OngoingScheduleComponent>;
  let dataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingScheduleComponent, ShowSignatureSchedularComponent, MultiDatePickerOngoingComponent ],
      imports: [ BrowserAnimationsModule, MultiDatePickerMaterialModule, RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MaterialModule, QuillModule.forRoot() ],
      providers: [ CreateReportLayoutService, { provide: MultiDatePickerOngoingService, useClass: MockMultipleDateService }, ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingScheduleComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(MultiDatePickerOngoingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test the changeDeliveryMethod parameters',()=>{
    let testdeliveryMethod = 1;
    fixture = TestBed.createComponent(OngoingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeDeliveryMethod(testdeliveryMethod);
    fixture.detectChanges();
    expect(component.isFtpHidden).toEqual(true);
  })

  it('should test the changeDeliveryMethod parameters',()=>{
    let testdeliveryMethod = 2;
    fixture = TestBed.createComponent(OngoingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.changeDeliveryMethod(testdeliveryMethod);
    fixture.detectChanges();
    expect(component.isFtpHidden).toEqual(false);
  })

  it('should assign the single date to "scheduleData.schedule_for_date" ',()=>{
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)
    mdpService.datesChosen = [ '03/04/2020' ]
    
    component.getSchedulingDates();

    expect([component.scheduleData.schedule_for_date]).toEqual(mdpService.datesChosen)
  })

  it('should assign the multiple date to "scheduleData.custom_dates" ',()=>{
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)
    mdpService.datesChosen = [ '03/04/2020', '04/04/2020' ]
    
    component.getSchedulingDates();

    expect(component.scheduleData.custom_dates).toEqual(mdpService.datesChosen)
    expect(component.scheduleData.schedule_for_date).toEqual('')
  })

  it('should set the email values',()=>{
    let testEmails = [];
    component = fixture.componentInstance;
    component.setMultipleAddressListValues();
    expect(component.scheduleData.multiple_addresses).toEqual(testEmails)
  })


  it('should test the notification value',()=>{
    let testNotificationValue = 'true';
    component.setNotificationValue(testNotificationValue);
    fixture.detectChanges();

    expect(component.scheduleData.notification_flag).toEqual(testNotificationValue);
  })

  it('should test the notification value',()=>{
    let testNotificationValue = 'false';
    component.setNotificationValue(testNotificationValue);
    fixture.detectChanges();

    expect(component.scheduleData.notification_flag).toEqual(testNotificationValue);
  })

  it('should test the setRecurringFlag and no custom_dates',()=>{
    let testValue = 'true';
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)

    component.setRecurringFlag(testValue);

    expect(component.isDatePickerHidden).toEqual(false);
    expect(component.isSetFrequencyHidden).toEqual(false);
    expect(mdpService.recurrencePattern).toEqual('');
    expect(component.scheduleData.recurring_flag).toEqual(testValue);
    expect(mdpService.isRecurringDatesMode).toEqual(true);
    expect(component.scheduleData.recurrence_pattern).toEqual('');
  })

  it('should test the setRecurringFlag and having custom_dates',()=>{
    let testValue = 'false';
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)
    component.scheduleData.custom_dates = [ '03/04/2020', '04/04/2020' ]

    component.setRecurringFlag(testValue);

    expect(component.isDatePickerHidden).toEqual(false);
    expect(component.isSetFrequencyHidden).toEqual(true);
    expect(mdpService.recurrencePattern).toEqual('');
    expect(component.scheduleData.recurring_flag).toEqual(testValue);
    expect(mdpService.isRecurringDatesMode).toEqual(false);
    expect(component.scheduleData.recurrence_pattern).toEqual('');
    expect(component.scheduleData.custom_dates).toEqual([])
  })

  it('should test the getRecipientList()',()=>{
    let mockRequestId: number = 11;
    fixture = TestBed.createComponent(OngoingScheduleComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(CreateReportLayoutService);
    fixture.detectChanges();
    service.getRequestDetails(mockRequestId).subscribe(res=>{
      expect(component.emails).toEqual(res['dl_list'].map(i=>i.distribution_list))
      expect(component.scheduleData.multiple_addresses).toEqual(component.emails)
    })
  })

  it('should test the reset of the multiple dates',()=>{
    component.schedulingDates = [ '03/04/2020', '04/04/2020']
    component.setSendingDates();

    expect(component.scheduleData.schedule_for_date).toEqual('')
  })

  it('should test the reset of the singledates',()=>{
    component.schedulingDates = [ '03/04/2020' ]
    component.scheduleData.custom_dates = [ '03/04/2020' ]
    component.setSendingDates();

    expect(component.scheduleData.custom_dates).toEqual([])
  })

  it('should test the valid dates',()=>{
    component.isEditingMode = false;
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)
    mdpService.datesChosen = [ '05/05/2020' ] // new date

    expect(component.stopSchedule).toEqual(false);
  })

  it('should check the unique email address',()=>{
    let testEmail = 'abcd@gm.com';
    component.emails = ['abcd@gm.com'];
    component.getDuplicateMessage(testEmail);
    expect(component.isDuplicate).toEqual(true)
  })

  it('should schedule the report with given details',()=>{
    let testScheduleData = { data : 'testData'}
    let mdpService = TestBed.inject(MultiDatePickerOngoingService)
    let scheduleService = TestBed.inject(ScheduleService);
    mdpService.datesChosen = [ '03/04/2020', '04/04/2020' ]
    component.scheduleData = {
      sl_id:'',
      created_by:'',
      report_list_id:'',
      report_request_id: '',
      report_name:'testName',
      schedule_for_date:'',
      schedule_for_time:'09:09',
      custom_dates:[ '03/04/2020', '04/04/2020' ],
      recurring_flag:'true',
      recurrence_pattern:'5',
      export_format:'1',
      notification_flag:'true',
      sharing_mode:'1',
      multiple_addresses:['abc@gm.com'],
      dl_list_flag:'',
      ftp_port:'',
      ftp_folder_path:'',
      ftp_address: '',
      ftp_user_name:'',
      ftp_pd:'',
      modified_by:'',
      dl_list:[],
      description:'testDescription',
      signature_html:'testSignature',
      is_file_uploaded:'false',
      uploaded_file_name:'',
      ecs_file_object_name:'',
      ecs_bucket_name:'',
      request_id:'1',
      is_Dqm:'false'
  };
  component.scheduleReport();

  expect(mdpService.datesChosen).not.toEqual([]);
  expect(scheduleService.scheduleReportIdFlag).toEqual(undefined);

  })

});

class MockMultipleDateService{
  public datesChosen : any = [];
  public recurrencePattern : any;
  public isRecurringDatesMode : any;
}