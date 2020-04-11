import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultiDatePickerOngoingService {

  public datesChosen : any = [];
  public isRecurringDatesMode : boolean = false;
  public recurrencePattern : string = '';

  constructor() { }
}
