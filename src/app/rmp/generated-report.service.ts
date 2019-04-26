import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject"

@Injectable({
  providedIn: 'root'
})
export class GeneratedReportService {

  private selectionSource =  new BehaviorSubject(0);
  currentSelections = this.selectionSource.asObservable();
  private report_status =  new BehaviorSubject("");
  currentstatus = this.report_status.asObservable();
  private messageSource = new BehaviorSubject<string>("");
  currentMessage = this.messageSource.asObservable();
  private divisionSelected = new BehaviorSubject([{}])
  currentDivisionSelected = this.divisionSelected.asObservable();
  private showOnBehalfOf =  new BehaviorSubject<boolean>(false);
  buttonStatus = this.showOnBehalfOf.asObservable();

  public saveChanges = new BehaviorSubject<boolean>(false);
  savedSelection = this.saveChanges.asObservable();

  public saveUpdate = new BehaviorSubject<boolean>(false);
  updatedChanges = this.saveUpdate.asObservable();
  
  constructor() { }

  changeSelection(report_id : number){
    this.selectionSource.next(report_id)
  }

  changeStatus(status : string){
    this.report_status.next(status)
  }

  changeMessage (showReportId:string) {
    this.messageSource.next(showReportId);
  }
  changeDivisionSelected(divisions : Array<object>){
    this.divisionSelected.next(divisions)
  }
  changeButtonStatus (showButton:boolean) {
    this.showOnBehalfOf.next(showButton);
  }

  changeSavedChanges (selectCriteria:boolean){
    this.saveChanges.next(selectCriteria)
    console.log('selectCriteria')
    console.log(selectCriteria)
  }

  changeUpdate (update:boolean){
    this.saveUpdate.next(update)
  }

}