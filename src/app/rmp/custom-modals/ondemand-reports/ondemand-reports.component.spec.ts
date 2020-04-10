import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from "../../../material.module"
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OndemandReportsComponent } from './ondemand-reports.component';
import { OndemandService } from '../ondemand.service';

describe('OndemandReportsComponent', () => {
  let component: OndemandReportsComponent;
  let fixture: ComponentFixture<OndemandReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OndemandReportsComponent],
      imports: [HttpClientTestingModule, MaterialModule.forRoot()],
      providers: [OndemandService]
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

  it('should emit the truthy odInfoObject object', () => {
    fixture = TestBed.createComponent(OndemandReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.onDemandScheduleId = 1;
    component.startOnDemandSchedule();
    component.odScheduleConfirmation.subscribe(res => {
      expect(res).toEqual({ confirmation: true, type: 'On Demand', scheduleId: 1, status: true })
    })
  })

  it('should emit the falsy odInfoObject object', () => {
    fixture = TestBed.createComponent(OndemandReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.startOnDemandSchedule();
    component.odScheduleConfirmation.subscribe(res => {
      expect(res).toEqual({ confirmation: true, type: 'On Demand', scheduleId: '', status: false })
    })
  })

  it('should manually test the ngOnChanges()', () => {
    let dummyProcuredReportId = 1;
    let dummyProcuredRequestId = 7;

    fixture = TestBed.createComponent(OndemandReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);
    fixture.detectChanges();
    service.getOnDemandConfigDetails(dummyProcuredReportId, dummyProcuredRequestId).subscribe(res => {
      expect(this.onDemandScheduleId).toEqual(res["data"][1]['schedule_id'][0]);
      expect(component.isLoading).toBeFalsy();
    })
  })

});
