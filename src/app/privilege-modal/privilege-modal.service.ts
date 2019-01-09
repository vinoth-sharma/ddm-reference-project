import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeModalService {
 
  public serviceUrl = `${environment.baseUrl}roles_and_responsibilities/userprivilege/`;
  
  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message:error.error
    };

    throw errObj;
  }

  public getAllUserandPrivilegeList() {
    return this.http.get(this.serviceUrl).pipe(catchError(this.handleError));
  }


  public updateSelectedList(options) {

    let requestBody = {
      user_id: options.user_id,
      privileges: options.privileges
    };

    return this.http
      .post(this.serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
