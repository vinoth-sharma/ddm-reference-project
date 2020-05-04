// migrated by Bharath.s
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class GeneratedReportService {

  private selectionSource = new BehaviorSubject(0);
  public currentSelections = this.selectionSource.asObservable();
  private report_status = new BehaviorSubject("");
  public currentstatus = this.report_status.asObservable();
  private messageSource = new BehaviorSubject<string>("");
  public currentMessage = this.messageSource.asObservable();
  private divisionSelected = new BehaviorSubject([{}])
  public currentDivisionSelected = this.divisionSelected.asObservable();
  private showOnBehalfOf = new BehaviorSubject<boolean>(false);
  public buttonStatus = this.showOnBehalfOf.asObservable();

  public saveChanges = new BehaviorSubject<boolean>(false);
  public savedSelection = this.saveChanges.asObservable();

  public saveUpdate = new BehaviorSubject<boolean>(false);
  public updatedChanges = this.saveUpdate.asObservable();

  private on_behalf = new BehaviorSubject("");
  public behalf_of_name = this.on_behalf.asObservable();

  public on_behalf_email = new BehaviorSubject("");
  public behalf_of_email = this.on_behalf_email.asObservable();

  private savedStatus = new BehaviorSubject<boolean>(false);
  public currentSaved = this.savedStatus.asObservable();

  private disclaimerStatus = new BehaviorSubject<boolean>(false);
  public currentDisclaimer = this.disclaimerStatus.asObservable();

  constructor() { }

  public changeSelection(report_id: number) {
    this.selectionSource.next(report_id)
  }

  public behalf_of(behalf: string) {
    this.on_behalf.next(behalf)
  }

  public behalf_email(email: string) {
    this.on_behalf_email.next(email)
  }

  public changeStatus(status: string) {
    this.report_status.next(status)
  }

  public changeMessage(showReportId: string) {
    this.messageSource.next(showReportId);
  }
  public changeDivisionSelected(divisions: Array<object>) {
    this.divisionSelected.next(divisions)
  }
  public changeButtonStatus(showButton: boolean) {
    this.showOnBehalfOf.next(showButton);
  }

  public changeSavedChanges(selectCriteria: boolean) {
    this.saveChanges.next(selectCriteria)
  }

  public changeUpdate(update: boolean) {
    this.saveUpdate.next(update)
  }

  public changeSaved(update: boolean) {
    this.savedStatus.next(update)
  }

  public changeDisclaimer(update: boolean) {
    this.disclaimerStatus.next(update)
  }
}
