import { TestBed, getTestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ConstantService } from './constant.service';

//// Angular Service Unit Test Cases written by Deepak Urs G V

describe('ConstantService', () => {
  let injector: TestBed;
  let service: ConstantService;
  let httpMock: HttpTestingController;
  let data = { data: "data" }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(ConstantService);
    httpMock = injector.inject(HttpTestingController);
  })

  it('should be created', () => {
    const service: ConstantService = TestBed.get(ConstantService);
    expect(service).toBeTruthy();
  });

  it('should get aggregations function data using the getAggregationFunctions() call', () => {
    service.getAggregationFunctions().subscribe(res => {
      expect(res).toEqual(data)
    })
  });

  it('should set data to "sqlFunctions" using the setFunctions()', () => {
    let testType = 'sql';
    service.setFunctions(data, testType);

    expect(service.sqlFunctions).toEqual(data);
  })

  it('should set data to "aggFunctions" using the setFunctions()', () => {
    let testType = 'aggregations';
    service.setFunctions(data, testType);

    expect(service.aggFunctions).toEqual(data);
  })

  it('should get "sqlFunctions" using the getSqlFunctions()', () => {
    let testType = 'sql';
    service.sqlFunctions = data;

    expect(service.sqlFunctions).toEqual(service.getSqlFunctions(testType))
  })

  it('should get "aggFunctions" using the getSqlFunctions()', () => {
    let testType = 'aggregations';
    service.aggFunctions = data;

    expect(service.aggFunctions).toEqual(service.getSqlFunctions(testType))
  })

  it('should call error handler', async(() => {
    let errorData = { error: { 'detail': "testDetail", 'redirect_url': "testUrl", 'error': "testError" }, status: 'testStatus' }
    let errObj: any = {
      status: errorData.status,
      data: {
        'detail': errorData.error.detail,
        'redirect_url': errorData.error.redirect_url,
        'error': errorData.error.error
      }
    }
    
    expect(function () { service.handleError(errorData) }).toThrow(errObj)
  }))

});
