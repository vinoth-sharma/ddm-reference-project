import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// HttpClientTestingModule imported to mock HttpClientModule
import { AddConditionsService } from './add-conditions.service';

describe('AddConditionsService', () => {
  let injector: TestBed;
  let service: AddConditionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddConditionsService]
    });

    injector = getTestBed();
    service = injector.inject(AddConditionsService);
    httpMock = injector.inject(HttpTestingController);
  });

  let conditions = {
    data: [
      { id: 1, condition_name: 'C1'},
      { id: 2, condition_name: 'C2'},
      { id: 3, condition_name: 'C3'},
    ],
  };

  it('fetchCondition() should return data', () => {
    service.fetchCondition(1).subscribe((res) => {
      expect(res).toEqual(conditions);
    });
    let req = httpMock.expectOne('http://localhost:8000/reports/get_existing_conditions/');
    expect(req.request.method).toBe('POST');
    req.flush(conditions);
  });

  // public delCondition(conditionId) {
  //   const deleteUrl = `http://localhost:8000/reports/ddmCondition/?condition_id=${conditionId}`;
  //   return this.http.delete(deleteUrl)
  //     .pipe(catchError(this.handleError));
  // }

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: AddConditionsService = TestBed.get(AddConditionsService);
    expect(service).toBeTruthy();
  });
});






