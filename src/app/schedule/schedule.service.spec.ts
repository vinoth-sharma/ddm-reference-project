import { TestBed, getTestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ScheduleService } from './schedule.service';

fdescribe('ScheduleService', () => {
  let injector: TestBed;
  let service: ScheduleService;
  let httpMock: HttpTestingController;
  let data = { data: "data" }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    // providers : [ Router, ScheduleService  ]
    providers: [ScheduleService, { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }]
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(ScheduleService);
    httpMock = injector.inject(HttpTestingController);
  })

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    const service: ScheduleService = TestBed.get(ScheduleService);
    expect(service).toBeTruthy();
  });

  it('should get report data using the getScheduledReports() call', async(() => {
    // let mockSemanticLayerId = 123;

    service.getScheduledReports(123).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/get_scheduled_reports?sl_id=123');
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  // It should fail as it sends a empty response (ongoing feature changes)
  // it('should get report data using the getScheduleReportData() call',async(()=>{
  //   // let mockRequestId = 1;

  //   service.getScheduleReportData(1).subscribe(res =>{
  //     expect(res).toEqual(data)
  //   })

  //   const req = httpMock.expectOne('http://localhost:8000/reports/report_scheduler?request_id=1');
  //   expect(req.request.method).toBe('GET');
  //   req.flush(data)
  // }))

  it('should get report data using the getScheduleReportData() call', async(() => {
    // let mockRequestId = 1;

    service.getScheduleReportData(1).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/report_scheduler?report_schedule_id=1');
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get report data using the getRequestDetailsForScheduler() call', async(() => {
    // let mockRequestId = 789;

    service.getRequestDetailsForScheduler(789).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/get_report_requests?report_list_id=789');
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should delete scheduled report data using the deleteScheduledReport() call', async(() => {
    // let mockRequestId = 2;

    service.deleteScheduledReport(2).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/report_scheduler/?report_schedule_id=2');
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))

  it('should save a report data for scheduling using the updateScheduleData() call', async(() => {
    // let mockRequestId = 2;
    let mockData = { data: "mockData" }

    service.updateScheduleData(mockData).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/report_scheduler/');
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  // Ask Baby kumar for API call link change or R&D
  // it('should edit a scheduled report data using the updateScheduleData() call',async(()=>{
  //   // let mockRequestId = 2;
  //   let mockData = { data:"mockData" }

  //   service.updateScheduleData(mockData).subscribe(res =>{
  //     expect(res).toEqual(data)
  //   })

  //   const req = httpMock.expectOne('http://localhost:8000/reports/report_scheduler/');
  //   expect(req.request.method).toBe('PUT');
  //   req.flush(data)
  // }))


  it('should call error handler', async(() => {
    let errorData = { error: "404 Not Found", status: "Failure" }
    let errObj: any = {
      status: errorData.status,
      message: errorData.error
    };
    expect(function () { service.handleError(errorData) }).toThrow(errObj)
  }))
});
