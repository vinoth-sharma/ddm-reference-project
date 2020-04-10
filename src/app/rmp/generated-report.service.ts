import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs"

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

  private on_behalf = new BehaviorSubject("");
  behalf_of_name = this.on_behalf.asObservable();

  public on_behalf_email = new BehaviorSubject("");
  behalf_of_email = this.on_behalf_email.asObservable();
  
  private savedStatus = new BehaviorSubject<boolean>(false);
  currentSaved = this.savedStatus.asObservable();

  private disclaimerStatus = new BehaviorSubject<boolean>(false);
  currentDisclaimer = this.disclaimerStatus.asObservable();
  
  constructor() { }

  changeSelection(report_id : number){
    this.selectionSource.next(report_id)
  }

  behalf_of(behalf:string){
    this.on_behalf.next(behalf)
  }

  behalf_email(email:string){
    this.on_behalf_email.next(email)
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
  }

  changeUpdate (update:boolean){
    this.saveUpdate.next(update)
  }

  changeSaved (update:boolean){
    this.savedStatus.next(update)
  }

  changeDisclaimer (update:boolean){
    this.disclaimerStatus.next(update)
  }
}
