import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})

export class SemdetailsService {

  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  fetchsem(sls: number) {
    const serviceurl = `${environment.baseUrl}semantic_layer/manage_tables/?sl_id=${sls}`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }

  getviews(sls: number) {
    const serviceurl = `${environment.baseUrl}semantic_layer/manage_views/?sl_id=${sls}`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }
}
