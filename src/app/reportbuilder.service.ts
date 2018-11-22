import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportbuilderService {

  response:any
  constructor(private http : HttpClient) {}
  task(){
    return this.http.get('./assets/report.json');
  }

}
