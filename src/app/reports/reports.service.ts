import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ReportsService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public getTables(tableId: number) {
    let getTablesUrl = `${environment.baseUrl}semantic_layer/send_related_tables/?table_id=${tableId}`;

    return this.http.get(getTablesUrl)
      .pipe(catchError(this.handleError));
  }

}
