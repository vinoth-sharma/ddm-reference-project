import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultipleDatesSelectionService {

  // @Input() overRideDate : String;
  public datesChosen : any = [];
  public isRecurringDatesMode : boolean = false;
  public recurrencePattern : string = '';

  constructor() { }
}
