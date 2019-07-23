import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ShareReportService {
  constructor(private http: HttpClient) {
  }
  public imageData = new BehaviorSubject<any[]>(null);
  public $imageData = this.imageData.asObservable();
  public isUploadInProgress = false;

  public setImageData(tables: any) {
    this.imageData.next(tables);
  }


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    throw errObj;
  }

  public getSignatures(Id) {
    let serviceUrl = `${environment.baseUrl}reports/reports_signature/?user_id=${Id}`;
    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public createSign(options) {
    let serviceUrl = `${environment.baseUrl}reports/reports_signature/`;
    let requestBody = new FormData();
    requestBody.append('signature_name', options.name);
    requestBody.append('user_id', options.userId);
    requestBody.append('signature_html', options.html);
    if (options['imageId']) {
      requestBody.append('image_id', options.imageId);
    }
    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public putSign(options) {
    let serviceUrl = `${environment.baseUrl}reports/reports_signature/`;
    let requestBody = new FormData();
    requestBody.append('signature_name', options.name);
    requestBody.append('signature_id', options.id);
    requestBody.append('signature_html', options.html);
    requestBody.append('user_id', options.userId);
    if (options['imageId']) {
      requestBody.append('image_id', options.imageId);
    }
    return this.http
      .put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public delSignature(id) {
    const deleteUrl = `${environment.baseUrl}reports/reports_signature/?signature_id=${id}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }

  public shareToUsersEmail(options) {
      let serviceUrl = `${environment.baseUrl}reports/sharing_report/`;
      // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/reports/sharing_report/`;
      let requestBody = new FormData();
      requestBody.append('report_list_id', options.report_list_id);
      requestBody.append('file_format', options.file_format);
      requestBody.append('delivery_method', options.delivery_method);
      requestBody.append('recepient_list', options.recepeint_list);
      requestBody.append('description', options.description);
      requestBody.append('signature_html', options.signature_html);
      requestBody.append('file_upload', options.file_upload);
      // requestBody.append('image_id', options.image_id);
      return this.http
        .post(serviceUrl, requestBody)
        .pipe(catchError(this.handleError));
    }

    public shareToUsersFtp(options) {
      let serviceUrl = `${environment.baseUrl}reports/sharing_report/`;
      let requestBody = new FormData();
      requestBody.append('report_list_id', options.report_list_id);
      requestBody.append('recepient_list', options.recepeint_list);
      requestBody.append('description', options.description);
      requestBody.append('file_upload', options.file_upload);
      requestBody.append('signature_html', options.signature_html);
      requestBody.append('file_format', options.file_format);
      requestBody.append('delivery_method', options.delivery_method);
      requestBody.append('ftp_address', options.ftp_address);
      requestBody.append('ftp_port', options.ftp_port);
      requestBody.append('ftp_user_name', options.ftp_user_name);
      requestBody.append('ftp_password', options.ftp_password); 
      requestBody.append('ftp_folder_path', options.ftp_folder_path);
      // requestBody.append('image_id', options.image_id);
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

    public verifyUser(name) {
    const serviceUrl = `${environment.baseUrl}reports/getldap_emailids/?user_to_search=${name}`;
    // const serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/reports/getldap_emailids?user_to_search=${name}`;
    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));
  }
}

