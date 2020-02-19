import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class MarketselectionService {

  private selectionSource =  new BehaviorSubject(0);
  currentSelections = this.selectionSource.asObservable();
  
  constructor() { }

  changeSelection(report_id : number){
    this.selectionSource.next(report_id)
  }
}
