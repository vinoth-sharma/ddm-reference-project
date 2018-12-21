import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeModalService {

  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  public getAllUserandPrivilegeList() {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/userprivilege/`;

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }


  public updateSelectedList(options) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/userprivilege/`;

    let requestBody = {
      user_id: options.user_id,
      privileges: options.privileges
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
