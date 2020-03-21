import { TestBed, getTestBed, async } from '@angular/core/testing';

import { ReportsService } from './reports.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ReportsService', () => {
  let injector: TestBed;
  let service : ReportsService;
  let httpMock : HttpTestingController;
  let data = {data:"data"}
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers:[ReportsService]
  })
  );

  beforeEach(()=>{
    injector = getTestBed();
    service = injector.inject(ReportsService);
    httpMock = injector.inject(HttpTestingController);
  })

  afterEach(()=>{
    httpMock.verify();
  })

  it('should be created', () => {
    const service: ReportsService = TestBed.inject(ReportsService);
    expect(service).toBeTruthy();
  });

  it('should get report data from the server',async(()=>{
    let mockUrl = 123
    service.getTables(mockUrl).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne('http://localhost:8000/semantic_layer/send_related_tables/?table_id=123');
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should call error handler',async(()=>{
    let errorData = {error:"404 Not Found",status:"Failure"}
    let errObj: any = {
      status: errorData.status,
      message: errorData.error
    };
   expect(function(){service.handleError(errorData)}).toThrow(errObj)
  }))
});
