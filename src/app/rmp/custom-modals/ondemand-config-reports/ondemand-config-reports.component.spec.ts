import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Utils from '../../../../utils';


import { OndemandConfigReportsComponent } from './ondemand-config-reports.component';
import { OndemandService } from '../ondemand.service';

describe('OndemandConfigReportsComponent', () => {
  let component: OndemandConfigReportsComponent;
  let fixture: ComponentFixture<OndemandConfigReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OndemandConfigReportsComponent],
      imports: [RouterTestingModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, MaterialModule],
      providers: [OndemandService, Utils]
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

  it('should test the ngOnInit()',()=>{
    expect(component.isLoading).toEqual(true);
  })

  it('should test the ngOnChanges()',()=>{
    let testOdcReportId = 1
    let testOdcRequestNumber = 2
    let service = fixture.debugElement.injector.get(OndemandService);
    component.isLoading = true;

    service.getOnDemandConfigDetails(testOdcReportId, testOdcRequestNumber).subscribe(res => {
      expect(component.odcRecievedDetails).toEqual(res);
    })
  })

  it('testing the updateOnDemandConfigurable() the true status ', () => {

    let testOdcData = {
      sheet_id: 'test_odcSheetId',
      request_id: 'test_odcRequestNumber',
      report_list_id: 'test_odcReportId',
      parameter_json: { 0: ['test_parameterJson1'], 1: ['test_parameterJson2'], 2: ['test_parameterJson3'], 3: ['test_parameterJson4'] }
    };

    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);
    component.onDemandConfigureScheduleId = 1;

    service.postOnDemandConfigDetails(testOdcData).subscribe(res => {
      spyOn(Utils, 'showSpinner');

      expect(Utils.showSpinner).toHaveBeenCalled();
      component.odcScheduleConfirmation.subscribe(res => {
        expect(res).toEqual(this.odcInfoObject = { confirmation: true, type: 'On Demand Configurable', scheduleId: component.onDemandConfigureScheduleId, status: true })

        service.refreshSaveSettingsValues(testOdcData.sheet_id, testOdcData.request_id).subscribe(response => {
          spyOn(Utils, 'hideSpinner');

          expect(Utils.hideSpinner).toHaveBeenCalled();
        })
      })
    })
  });

  it('testing the updateOnDemandConfigurable() the false status ', () => {

    let testOdcData = {
      sheet_id: 'test_odcSheetId',
      request_id: 'test_odcRequestNumber',
      report_list_id: 'test_odcReportId',
      parameter_json: { 0: ['test_parameterJson1'], 1: ['test_parameterJson2'], 2: ['test_parameterJson3'], 3: ['test_parameterJson4'] }
    };

    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);

    service.postOnDemandConfigDetails(testOdcData).subscribe(res => {
      spyOn(Utils, 'showSpinner');

      expect(Utils.showSpinner).toHaveBeenCalled();
      component.odcScheduleConfirmation.subscribe(res => {
        expect(res).toEqual(this.odcInfoObject = { confirmation: true, type: 'On Demand Configurable', scheduleId: component.onDemandConfigureScheduleId, status: false })

        service.refreshSaveSettingsValues(testOdcData.sheet_id, testOdcData.request_id).subscribe(response => {
          spyOn(Utils, 'hideSpinner');

          expect(Utils.hideSpinner).toHaveBeenCalled();
        })
      })
    })
  });

  it('testing the updateSaveSettings() with the post call ', () => {

    let testSaveSettingsRequestBody = {
      request_id: 'testOdcRequestNumber',
      sheet_id: 'testOdcSheetId',
      fields: 'testSaveSettingsValuesFinal'
    }

    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);
    // component.saveSettingsData[0] = 
    service.postSaveSettings(testSaveSettingsRequestBody).subscribe(res => {
      spyOn(Utils, 'showSpinner');
      spyOn(Utils, 'hideSpinner');

      expect(Utils.showSpinner).toHaveBeenCalled();
      expect(Utils.hideSpinner).toHaveBeenCalled();

    })
  });

  it('testing the updateSaveSettings() with the edit call ', () => {

    let testSaveSettingsRequestBody = {
      request_id: 'testOdcRequestNumber',
      sheet_id: 'testOdcSheetId',
      fields: 'testSaveSettingsValuesFinal'
    }

    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);
    // component.saveSettingsData[0] = 
    service.editSaveSettings(testSaveSettingsRequestBody).subscribe(res => {
      spyOn(Utils, 'showSpinner');
      spyOn(Utils, 'hideSpinner');

      expect(Utils.showSpinner).toHaveBeenCalled();
      expect(Utils.hideSpinner).toHaveBeenCalled();
    })
  });

  it('testing setSheetVaalues', ()=>{
    component.miniSpinner = true;
    let testSheetName = 'testingSheet';
    let testSheetId = 1 ;
    let testOdcRequestNumber = 2;

    fixture = TestBed.createComponent(OndemandConfigReportsComponent);
    component = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OndemandService);
    service.getSaveSettingsValues(testSheetId, testOdcRequestNumber).subscribe(res => {
      let testresultData = res['data'].splice(-1);
      let testsaveSettingsData = testresultData.map(i => i.fields);
      expect(component.saveSettingsData).toEqual(testsaveSettingsData)
      expect(component.miniSpinner).toEqual(false);
    })
    

  })

});
