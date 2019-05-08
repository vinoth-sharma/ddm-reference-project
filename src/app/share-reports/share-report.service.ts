import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareReportService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

  public getSignatures() {
    let serviceUrl = `${environment.baseUrl}reports/reports_signature/?user_id=${"USER1"}`;
    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public createSign(options) {
    // let serviceUrl = `${environment.baseUrl}reports/reports_signature/`;
    // let requestBody = {
    //   user_id: options.user_id,
    //   report_list_id: options.report_list_id
    // };
    // return this.http
    //   .post(serviceUrl, requestBody)
    //   .pipe(catchError(this.handleError));
  }

  public putSign(options) {
    // let serviceUrl = `${environment.baseUrl}reports/reports_signature/`;
    // let requestBody = {
    //   user_id: options.user_id,
    //   report_list_id: options.report_list_id
    // };
    // return this.http
    //   .put(serviceUrl, requestBody)
    //   .pipe(catchError(this.handleError));
  }

  public shareToUsers(options) {
    let serviceUrl = `${environment.baseUrl}reports/sharing_report/`;
    let requestBody = new FormData();
    requestBody.append('report_name', options.user_id);
    requestBody.append('report_list_id', options.report_list_id);
    requestBody.append('file_format', options.file_format);
    requestBody.append('delivery_method', options.delivery_method);
    requestBody.append('recepeint_list', options.recepeint_list);
    requestBody.append('description', options.description);
    // requestBody.append('signature_html', options.user_id);
    // requestBody.append('file_upload', fileObject);
    //   options['description'] = this.description;
    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  uploadFile(fileObject: File) {
    let serviceUrl = `${environment.baseUrl}reports/image_upload/`;
    let requestBody = new FormData();
    requestBody.append('image', fileObject);
    return this.http.post(serviceUrl, requestBody);
    // return Observable.of({ url: 'assets/disclaimer3.jpeg' });
  }
}
