import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BrandFormsService {

  constructor(private http: HttpClient) { }

  public getBrandFormsData() {
    let serviceUrl = `${environment.baseUrl}RMP/manage_brand_form/`;
    return this.http.get(serviceUrl)
  }

  public updateBrandFormsDataRecord(objectToBeUpdated: any) {
    let serviceUrl = `${environment.baseUrl}RMP/manage_brand_form/`;
    return this.http.put(serviceUrl, objectToBeUpdated)
  }

  // Do not delete: Can be used for future implemetation
  public deleteBrandFormsDataRecord(objectToBeDeleted: any) {
    let serviceUrl = `${environment.baseUrl}RMP/manage_brand_form/?brand_value=${objectToBeDeleted['brand_value']}&alloc_grp_cd_val=${objectToBeDeleted['alloc_grp_cd_val']}`;
    return this.http.delete(serviceUrl)
  }
}
