import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthSsoService {

  private _startupData: any;
  public token_id: any ;

  constructor(private http: HttpClient,
    private authenticationService:AuthenticationService,
   
    private injector: Injector) {
   }
   public get router(){
    return this.injector.get(Router);
  }

  public get toastrService(){
    return this.injector.get(ToastrService);
  }
       public get cookies(){
         return this.injector.get(CookieService);
       }

  load() {

      this._startupData = null;

      this.sendToken().subscribe(
        res =>{
          console.log(res,'res in login');
          this._startupData = res;
          this.authenticationService.SetUserDetails();
          this.authenticationService.myMethod(res['usersdetails'],res['usersdetails']['user_id']);
          this.authenticationService.errorMethod(res['usersdetails']['user_id']);
          this.router.navigate(['user']);
        },err =>{
          // console.log(err,'err in login');
          // this.getTokenId();
          // if(err.data.redirect_url){
          //   window.location.href = err.data.redirect_url;
          // }else{
          //   this.toastrService.error('There seems to be an error. Please try again later.');
          // }
         
        })
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

  sendToken() {
    const serviceurl = `${environment.baseUrl}login/check_status`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }

  get startupData(): any {
      return this._startupData;
  }

  public getTokenId(){
    
    return this.cookies.get('session_key');
  }
  
}
