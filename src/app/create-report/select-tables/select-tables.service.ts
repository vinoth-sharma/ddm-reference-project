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
  
  public getRelatedTables(tableId: number) {
    let getTablesUrl = `${environment.baseUrl}semantic_layer/send_related_tables/?table_id=${tableId}`;
    return this.http.get(getTablesUrl)
      .pipe(catchError(this.handleError));
  }
}