import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class SelectTablesService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public getColumns(data: any) {
    let url = `${environment.baseUrl}semantic_layer/table_level_column_property/`;
    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }
}