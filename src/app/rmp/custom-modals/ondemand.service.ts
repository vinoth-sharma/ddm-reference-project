import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OndemandService {

  constructor(private http:HttpClient) { }
  
  public getOnDemandConfigDetails(reportListId,requestId){
    let serviceUrl = `${environment.baseUrl}reports/configure_on_demand?report_list_id=${reportListId}&request_id=${requestId}`;
    return this.http.get(serviceUrl);
  }
}
