import { Injectable } from '@angular/core';
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class CalculatedColumnService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public addColumn(data: any) {
    let addUrl = `${environment.baseUrl}semantic_layer/calculated_column_custom_table/`;

    return this.http.post(addUrl, data)
      .pipe(catchError(this.handleError));
  }
}