import { Injectable, Injector } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ConstantService } from './constant.service';
import { CustomCookieService } from './custom-directives/ng-custom-cookies-service/custom.cookies.service'


@Injectable({
  providedIn: 'root'
})
export class AuthSsoService {

  private _userData: any;
  public token_id: any;

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private constantService: ConstantService,
    private injector: Injector) { }

  public get router() {
    return this.injector.get(Router);
  }

  public get cookies() {
    return this.injector.get(CustomCookieService);
  }

  public authLoad() {
    this.checkToken().subscribe(
      res => {
        this._userData = res;
        this.authenticationService.SetUserDetails();
        this.authenticationService.myMethod(res['usersdetails'], res['usersdetails']['user_id'], res['schema']);
        this.authenticationService.errorMethod(res['usersdetails']['user_id']);
        this.getAllFunctions();
      }, err => {
        // console.log(err,'err in login');
      });
  }


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      data: {
        'detail': error.error.detail,
        'redirect_url': error.error.redirect_url,
        'error': error.error.error
      }
    }
    throw errObj;
  }

  checkToken() {
    const serviceurl = `${environment.baseUrl}login/check_status`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }

  public getTokenId() {
    return this.cookies.get('session_key');
  }

  public deleteToken() {
    this.cookies.delete('session_key');
  }

  public getAllFunctions() {
    this.constantService.getAggregationFunctions().subscribe(
      res => {
        this.constantService.setFunctions(res['data'], 'aggregation');
      },
      err => {
        this.constantService.setFunctions([], 'aggregation');
      }
    )
  }
}
