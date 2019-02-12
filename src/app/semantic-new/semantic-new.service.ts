import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SemanticNewService {

  private dataSubject = new BehaviorSubject<any>([]);
  dataMethod$: Observable<any>;
  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    throw errObj;
  };

  constructor(private http: HttpClient) { this.dataMethod$ = this.dataSubject.asObservable() }

  dataMethod(semanticLayers) {
    this.dataSubject.next(semanticLayers);
  }

  createSemanticLayer(data) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_semantic_layer/`;
    return this.http.post(serviceUrl, data)
      .pipe(catchError(this.handleError));
  }

}