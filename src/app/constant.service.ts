import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public sqlFunctions: any = [];
  public aggFunctions: any = [];

  constructor(private http: HttpClient) { }

  getAggregationFunctions() {
    const serviceurl = `${environment.baseUrl}reports/aggregation_functions`;
    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
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

  public setFunctions(data: any, type: string) {
    (type === 'sql') ? this.sqlFunctions = data : this.aggFunctions = data;
  }

  public getSqlFunctions(type: string) {
    if (type === 'sql') {
      return this.sqlFunctions
    } else {
      return this.aggFunctions;
    }
  }
}
