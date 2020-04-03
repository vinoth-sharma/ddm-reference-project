import { TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { FormulaService } from './formula.service';
import { HttpClientTestingModule, 
         HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../../../environments/environment";

describe('FormulaService', () => {

  let injector: TestBed;
  let formulaService: FormulaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ 
        imports:[HttpClientTestingModule],
        providers: [FormulaService]
       });
     injector = getTestBed();
     formulaService = injector.get(FormulaService); 
     httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(()=> {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: FormulaService = TestBed.get(FormulaService);
    expect(service).toBeTruthy();
  });

  it('should return expected generateReport method', fakeAsync(() => { 
      const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.generateReport(expectedHeroes).
      subscribe(res =>  expect(res).toBe(expectedHeroes) );
      const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
        expect(request.url).toEqual(`${environment.baseUrl}reports/generate_report/`);
        expect(request.method).toBe('POST');
        return true;
      }); 
      request.flush(expectedHeroes);
      tick();
  }));

  it('should return expected createSheetToExistingReport method', fakeAsync(() => { 
    const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.createSheetToExistingReport(2).
      subscribe(res => expect(res).toBe(expectedHeroes));
    const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
      expect(request.url).toEqual(`${environment.baseUrl}reports/report_creation/`);
      expect(request.method).toBe('POST');
      return true;
    }); 
    request.flush(expectedHeroes);
    tick();    
  }));

  it('should return expected uploadReport method', fakeAsync(() => {
      const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.uploadReport(2).
      subscribe(res => expect(res).toBe(expectedHeroes));
      const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
        expect(request.url).toEqual(`${environment.baseUrl}reports/ddm_report_upload/`);
        expect(request.method).toBe('POST');
        return true;
      }); 
      request.flush(expectedHeroes);
      tick(); 
   }));

});

 