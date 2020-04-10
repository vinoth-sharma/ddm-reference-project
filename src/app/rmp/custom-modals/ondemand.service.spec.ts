import { TestBed, getTestBed, async } from '@angular/core/testing';

import { OndemandService } from './ondemand.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from "../../../environments/environment";

describe('OndemandService', () => {
  let injector: TestBed;
  let service : OndemandService;
  let httpMock : HttpTestingController;
  let data = {data:"data"}
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers:[OndemandService]
  }));

  beforeEach(()=>{
    injector = getTestBed();
    service = injector.inject(OndemandService);
    httpMock = injector.inject(HttpTestingController);
  })

  afterEach(()=>{
    httpMock.verify();
  })

  it('should be created', () => {
    const service: OndemandService = TestBed.get(OndemandService);
    expect(service).toBeTruthy();
  });

  it('should get OnDemandConfigDetails from the server',async(()=>{
    let reportListId = 123;
    let requestId  = 123;
    let serviceUrl = `${environment.baseUrl}reports/configure_on_demand?report_list_id=${reportListId}&request_id=${requestId}`;
    service.getOnDemandConfigDetails(reportListId,requestId).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  post OnDemandConfigDetails to  the server',async(()=>{
    let odcData = {key:"value"}
    let serviceUrl = `${environment.baseUrl}reports/configure_on_demand`;
    service.postOnDemandConfigDetails(odcData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should  post SaveSettings to  the server',async(()=>{
    let saveSettingsData = {sheet_id:1,request_id:2}
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsData.sheet_id}&request_id=${saveSettingsData.request_id}`;
    service.postSaveSettings(saveSettingsData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should  update SaveSettings in  the server',async(()=>{
    let saveSettingsData = {sheet_id:1,request_id:2}
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsData.sheet_id}&request_id=${saveSettingsData.request_id}`;
    service.putSaveSettings(saveSettingsData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should  get SaveSettings from  the server',async(()=>{
    let saveSettingsSheetId = 1;
    let saveSettingsRequestId = 1
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsSheetId}&request_id=${saveSettingsRequestId}`;
    service.getSaveSettingsValues(saveSettingsSheetId,saveSettingsRequestId).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  delete SaveSettings in  the server',async(()=>{
    let saveSettingsSheetId = 1;
    let saveSettingsRequestId = 1
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsSheetId}&request_id=${saveSettingsRequestId}`;
    service.refreshSaveSettingsValues(saveSettingsSheetId,saveSettingsRequestId).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))


});
