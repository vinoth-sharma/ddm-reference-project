import { TestBed, getTestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SaveReportService } from './save-report.service';

describe('SaveReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let injector: TestBed;
  let service: SaveReportService;
  let httpMock: HttpTestingController;
  let data = { data: "data" }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [SaveReportService]
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(SaveReportService);
    httpMock = injector.inject(HttpTestingController);
  })

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    const service: SaveReportService = TestBed.get(SaveReportService);
    expect(service).toBeTruthy();
  });

  it('should get All users data using the getAllUsers() call', async(() => {
    let mockSemanticLayerId = 123;

    service.getAllUsers(123).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/roles_and_responsibilities/get_users?sl_id=123');
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get share the report to a user using the shareToLandingPage() call', async(() => {
    let mockData = {
      user_id: 'mockUserId',
      report_list_id: 'mockreportListId'
    }

    service.shareToLandingPage(mockData).subscribe(res => {
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/reports/report_share/');
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should call error handler', async(() => {
    let errorData = { error: "404 Not Found", status: "Failure" }
    let errObj: any = {
      status: errorData.status,
      message: errorData.error
    };
    expect(function () { service.handleError(errorData) }).toThrow(errObj)
  }))

});
