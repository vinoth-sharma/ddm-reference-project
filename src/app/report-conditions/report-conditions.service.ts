import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ReportConditionsService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public getConditions(tableName: string) {
    let url = `${environment.baseUrl}reports/ddmCondition?table_name=${tableName}`;

    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

}
