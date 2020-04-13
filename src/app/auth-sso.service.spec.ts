import { async, TestBed,inject, fakeAsync, getTestBed, tick } from '@angular/core/testing';
import { AuthSsoService } from './auth-sso.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from './authentication.service';
import { environment } from '../environments/environment';
import { of, BehaviorSubject } from 'rxjs';
import { ConstantService } from './constant.service';
import { CustomPipeModules } from "./custom-directives/custom.pipes.module";

describe('AuthSsoService', () => {
  let injector: TestBed;
  let service: AuthSsoService;
  let httpMock: HttpTestingController;

  beforeEach(() =>{ TestBed.configureTestingModule({
                    imports:[ 
                        HttpClientTestingModule,
                        RouterTestingModule.withRoutes([]),
                        CustomPipeModules.forRoot()
                      ],
                    providers: [ AuthenticationService ]  
                  });
                  injector = getTestBed();
                  service = injector.get(AuthSsoService);
                  httpMock = injector.get(HttpTestingController);
                });

afterEach(() => {
  httpMock.verify();
});              

  it('should be created', () => {
    const service: AuthSsoService = TestBed.get(AuthSsoService);
    expect(service).toBeTruthy();
  });

  it('should execute checkToken method', fakeAsync(() => {
    const result = [1,2,2,3];
    service.checkToken().subscribe(res => {
      expect(res).toEqual(result);
    });
    const req = httpMock.expectOne(`${environment.baseUrl}login/check_status`);
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has('Authorization')).toEqual(false);
    req.flush(result);
  }));

  it('should execute getTokenId method', fakeAsync(()=>{
    spyOn(service, 'getTokenId').and.callThrough();
      let result = service.getTokenId();
    expect(service.getTokenId).toHaveBeenCalled();  
  }));

  it('should execute deleteToken method', fakeAsync(()=>{
    spyOn(service, 'deleteToken').and.callThrough();
      let result = service.deleteToken();
    expect(service.deleteToken).toHaveBeenCalled();  
  }));

  it('should execute authLoad method', fakeAsync(() => {
    const result = {
      usersdetails: {
        user_id: 1
      }
    };
    spyOn(service, 'checkToken').and.returnValues(of(result));
    spyOn(service, 'authLoad').and.callThrough();
    service.authLoad();
    tick(1500);
    expect(service.authLoad).toHaveBeenCalled();
    const req = httpMock.expectOne(`${environment.baseUrl}reports/aggregation_functions`);
    expect(req.request.method).toBe("GET");
    req.flush(result);
  }));

  it('should execute getAllFunctions method', fakeAsync(() => {
    const constantService: ConstantService = TestBed.get(ConstantService);
    const result = {
     data:'checking'
    };
   let mySpy = spyOn(constantService, 'getAggregationFunctions').and.returnValues(of(result));
    spyOn(service, 'getAllFunctions').and.callThrough();
    service.getAllFunctions();
    tick(1500);
    expect(service.getAllFunctions).toHaveBeenCalled();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1);
  }));
});
