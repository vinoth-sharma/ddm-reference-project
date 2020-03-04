import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// HttpClientTestingModule imported to mock HttpClientModule
import { SelectTablesService } from './select-tables.service';

describe('SelectTablesService', () => {
  let injector: TestBed;
  let service: SelectTablesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SelectTablesService]
    });

    injector = getTestBed();
    service = injector.inject(SelectTablesService);
    httpMock = injector.inject(HttpTestingController);
  });

  let relatedTables = {
    data: [
      { id: 1, first_name: 'George', last_name: 'Bluth' },
      { id: 2, first_name: 'Janet', last_name: 'Weaver' },
      { id: 3, first_name: 'Emma', last_name: 'Wong' },
    ],
  };

  it('getRelatedTables() should return data', () => {
    service.getRelatedTables(1).subscribe((res) => {
      expect(res).toEqual(relatedTables);
    });

    let req = httpMock.expectOne('http://localhost:8000/semantic_layer/send_related_tables/?table_id=1');
    expect(req.request.method).toBe('GET');
    req.flush(relatedTables);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: SelectTablesService = TestBed.get(SelectTablesService);
    expect(service).toBeTruthy();
  }); 
});



