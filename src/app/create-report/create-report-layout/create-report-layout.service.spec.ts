import { TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { CreateReportLayoutService } from './create-report-layout.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../../../environments/environment";

describe('CreateReportLayoutService', () => {

  let injector: TestBed;
  let createReportLayoutService: CreateReportLayoutService;
  let httpMock: HttpTestingController;

  beforeEach(() =>{
    TestBed.configureTestingModule({ 
      imports:[HttpClientTestingModule],
      providers: [ CreateReportLayoutService ]
    });
     injector = getTestBed();
     createReportLayoutService = injector.get(CreateReportLayoutService); 
     httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(()=> {
      httpMock.verify();
    });

  it('should be created', () => {
    const service: CreateReportLayoutService = TestBed.get(CreateReportLayoutService);
    expect(service).toBeTruthy();
  });

  it('should return expected getAllForEdit method', fakeAsync(() => {
        const inputparams = {
                              'report': "661",
                              'sheet': "1082" 
                            };
        const result =  {
                          'report': "661",
                          'sheet': "1082" 
                        };                       
        createReportLayoutService.getAllForEdit(inputparams)
        .subscribe(res => expect(res).toBe(result));
        
        const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
          expect(request.url).toEqual(`${environment.baseUrl}reports/get_report_edit_data?report_id=661&sheet_id=1082`);
          expect(request.method).toBe('GET');
          return true;
        });

        request.flush(result);
        tick();
  }));

  it('should return expected getRequestDetails method', fakeAsync(() => {
        const expectedResult = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
        createReportLayoutService.getRequestDetails(3142).
        subscribe(res =>  expect(res).toBe(expectedResult));

        const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
          expect(request.url).toEqual(`${environment.baseUrl}RMP/get_report_description/?report_id=3142`);
          expect(request.method).toBe('GET');
          return true;
        });
        request.flush(expectedResult);
        tick();
   }));
});
