import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthSsoService {

  private _startupData: any;

  constructor(private http: HttpClient
    ,private injector: Injector) {
  // ){
   }

   public get router() {
     return this.injector.get(Router);
       }

  // This is the method you want to call at bootstrap
  // Important: It should return a Promise
  load() {

      this._startupData = null;

      this.sendToken().subscribe(
        res =>{
          console.log(res,'res in login');
          this._startupData = res;
          
        },err =>{
          console.log(err,'err in login');
          // this.router.navigate(['/externalRedirect',{
          //   externalUrl: err.data.redirect_url
          // }]);
          window.location.href = err.data.redirect_url;
        })
      // return this.http
      //     .get('http://localhost:8000//')
      //     .map((res: Response) => res.json())
      //     .toPromise()
      //     .then((data: any) => this._startupData = data)
      //     .catch((err: any) => Promise.resolve());
  }


  public handleError(error: any): any {
    // let err = JSON.parse(error._body);
    // console.log(err,'error in hanfle err');
    
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
}
