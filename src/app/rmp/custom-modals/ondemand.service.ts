// migrated by Bharath.s
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

  public postOnDemandConfigDetails(odcData:any){
    let serviceUrl = `${environment.baseUrl}reports/configure_on_demand`;
    return this.http.post(serviceUrl,odcData);
  }

  public postSaveSettings(saveSettingsData:any){
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsData.sheet_id}&request_id=${saveSettingsData.request_id}`;
    return this.http.post(serviceUrl,saveSettingsData);
  }

  public editSaveSettings(saveSettingsData:any){
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsData.sheet_id}&request_id=${saveSettingsData.request_id}`;
    return this.http.post(serviceUrl,saveSettingsData);
  }

  public getSaveSettingsValues(saveSettingsSheetId,saveSettingsRequestId){
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsSheetId}&request_id=${saveSettingsRequestId}`;
    return this.http.get(serviceUrl);
  }

  public refreshSaveSettingsValues(saveSettingsSheetId,saveSettingsRequestId){
    let serviceUrl = `${environment.baseUrl}RMP/save_settings/?sheet_id=${saveSettingsSheetId}&request_id=${saveSettingsRequestId}`; 
    return this.http.delete(serviceUrl);
  }
  
}