import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSsoService {

  private _userData: any;
  public token_id: any;

  constructor(private http: HttpClient,
              private authenticationService:AuthenticationService,
              private injector: Injector) 
              {}

   public get router() {
    return this.injector.get(Router);
  }
       
  public get cookies() {
    return this.injector.get(CookieService);
  }

  authLoad() {

      this.checkToken().subscribe(
        res =>{
          this._userData = res;
          this.authenticationService.SetUserDetails();
          this.authenticationService.myMethod(res['usersdetails'],res['usersdetails']['user_id']);
          this.authenticationService.errorMethod(res['usersdetails']['user_id']);
          this.router.navigate(['user']);
        },err =>{
          // console.log(err,'err in login');
        });
  }


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      data: {
        'detail' :error.error.detail,
        'redirect_url' : error.error.redirect_url,
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
  
  public setTokenId() {
    this.cookies.set('session_key','');
  }
}
