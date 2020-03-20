import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SecurityModalService } from './security-modal.service';

describe('SecurityModalService', () => {
  let injector: TestBed;
  let service: SecurityModalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecurityModalService]
    });

    injector = getTestBed();
    service = injector.inject(SecurityModalService);
    httpMock = injector.inject(HttpTestingController);
  });

  let semanticList = {
    data: [
      { id: 1, first_name: 'George', last_name: 'Bluth' },
      { id: 2, first_name: 'Janet', last_name: 'Weaver' },
      { id: 3, first_name: 'Emma', last_name: 'Wong' },
    ],
  };

  it('getUserDetails() should return data', () => {
    service.getUserList("AneeshaBiju").subscribe((res) => {
      expect(res).toEqual(semanticList); 
    });

    const req = httpMock.expectOne('http://localhost:8000/roles_and_responsibilities/get_users_ldap?search_str=AneeshaBiju');
    expect(req.request.method).toBe('GET');
    // Flushing dummy "http" response
    req.flush(semanticList); 
  });

  it('getAllUserandSemanticList() should return data', () => {
    service.getAllUserandSemanticList().subscribe((res) => {
      expect(res).toEqual(semanticList);
    });

    let req = httpMock.expectOne('http://localhost:8000/roles_and_responsibilities/security/');
    expect(req.request.method).toBe('GET');
    req.flush(semanticList);
  });

  it('getListByOption() should POST and return data', () => {
    let requestBody = {
      user_id: 'user_1',
      sl_name: 'sl_1'
    };
    service.getListByOption(requestBody).subscribe((res) => {
      expect(res).toEqual({ msg: 'success' });
    });

    const req = httpMock.expectOne('http://localhost:8000/roles_and_responsibilities/security/');
    expect(req.request.method).toBe('POST');
    req.flush({ msg: 'success' });
  });

  it('getLogData() should return data', () => {
    service.getLogData(1,'17/01/2010','17/08/2010').subscribe((res) => {
      expect(res).toEqual(semanticList); 
    });

    const req = httpMock.expectOne('http://localhost:8000/log_entry/get_log_data?log_type=1&start_date=17/01/2010&end_date=17/08/2010');
    expect(req.request.method).toBe('GET');
    // Flushing dummy "http" response
    req.flush(semanticList); 
  });

  it('updateSelectedList() should PUT and return data', () => {
    let requestBody = {
      user_id: 'user_1',
      sl_name: 'sl_1',
      case_id: 1
    };
    service.updateSelectedList(requestBody).subscribe((res) => {
      expect(res).toEqual({ msg: 'success' });
    });

    const req = httpMock.expectOne('http://localhost:8000/roles_and_responsibilities/security/');
    expect(req.request.method).toBe('PUT');
    req.flush({ msg: 'success' });
  });


  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: SecurityModalService = TestBed.get(SecurityModalService);
    expect(service).toBeTruthy();
  }); 
});







