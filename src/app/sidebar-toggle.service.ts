import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {

  constructor() { }
  
  public toggle = new Subject<boolean>();
  public relatedData = new Subject<any>();
  public originalRelatedData = new Subject<any>();

  public $toggle = this.toggle.asObservable();
  public $relatedData = this.relatedData.asObservable();
  public $originalRelatedData = this.originalRelatedData.asObservable();

  setToggle(val:boolean){
    this.toggle.next(val);
  }

  setValue(val:any){
    this.relatedData.next(val);
  }

  setOriginalValue(val:any){
    this.originalRelatedData.next(val);
  }
}
