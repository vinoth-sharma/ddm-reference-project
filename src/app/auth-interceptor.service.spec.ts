import { async, TestBed,inject, fakeAsync, getTestBed, tick } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor.service';
import { AuthSsoService } from './auth-sso.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../environments/environment";

describe('AuthInterceptor', () => { 
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let authSsoService: AuthSsoService;

    beforeEach(() =>{ TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule ],
        providers:[ AuthSsoService, AuthInterceptor ]
        });
        injector = getTestBed();
        authSsoService = injector.get(AuthSsoService); 
        httpMock = TestBed.get(HttpTestingController)
    });

    afterEach(()=> {
        httpMock.verify();
      }); 

    it('should be created', () => {
        const service: AuthSsoService = TestBed.get(AuthSsoService);
        expect(service).toBeTruthy();
    });

    it('should execute checkToken method', fakeAsync(() => {
        const result = [1,2,2,3];
        authSsoService.checkToken().subscribe(res => 
          expect(res).toEqual(result));
        const req = httpMock.expectOne(`${environment.baseUrl}login/check_status`);
        expect(req.request.method).toBe("GET");
        expect(req.request.headers.has('Authorization')).toEqual(true);
        req.flush(result);
      }));
});