import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SemdetailsService {
public sls;
myMethod$: Observable<any>; 
private myMethodSubject = new BehaviorSubject<any>("");
constructor(private http:HttpClient) { 
this.myMethod$ = this.myMethodSubject.asObservable();
  }
myMethod(userInformation){
console.log(userInformation);
this.myMethodSubject.next(userInformation);
  } 

fetchsem(sls:number)
{  const serviceurl = `http://127.0.0.1:8000/semantic_layer/tables/?sl_id=${sls}`;
return this.http.get(serviceurl); };
};


