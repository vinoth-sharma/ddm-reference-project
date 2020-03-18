import { Component, OnInit, ViewEncapsulation, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { NgToasterComponent } from "../../custom-directives/ng-toaster/ng-toaster.component";

import { MultipleDatesSelectionService } from './multiple-dates-selection.service'

@Component({
  selector: 'app-multiple-dates-picker',
  templateUrl: './multiple-dates-picker.component.html',
  styleUrls: ['./multiple-dates-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MultipleDatesPickerComponent implements OnInit {

  // @Input() overRideData : any ;
  // @Output() datesChosen = new EventEmitter();.emit()
  
  constructor( public multipleDatesSelectionService : MultipleDatesSelectionService,
                public toasterService : NgToasterComponent) { }

  ngOnInit(): void {
  }

  // ngOnChanges(changes : SimpleChanges) {
  //   if('overRideDate' in changes){
  //     console.log('CHANGES seen in TODAYs date : ',changes);
  //     this.daysSelected = this.multipleDatesSelectionService.datesChosen;
  //     this.daysSelectedDisplayed = [...this.daysSelected];
  //   }
  // }

public daysSelected: any = [];
public daysSelectedDisplayed: any = [];
event: any;

isSelected = (event: any) => {
  const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

  return this.daysSelected.find(x => x == date) ? "selected" : null;
};

select(event: any, calendar: any) {
  const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

  
  const index = this.daysSelected.findIndex(x => x == date);

  if (index < 0) {
    if(( this.daysSelected.length == 0 && this.multipleDatesSelectionService.isRecurringDatesMode == false ) || ( this.daysSelected.length >= 0 && this.multipleDatesSelectionService.isRecurringDatesMode == true && (this.multipleDatesSelectionService.recurrencePattern.length != 0) )){
      if(this.multipleDatesSelectionService.recurrencePattern == '1'){
        this.daysSelected = [ this.multipleDatesSelectionService.datesChosen[0] ];
        this.daysSelectedDisplayed = [...this.daysSelected] ; 
      }
      this.daysSelected.push(date);
      this.daysSelectedDisplayed.push(date);
    }
    else{
      if( this.daysSelected.length == 1 && this.multipleDatesSelectionService.isRecurringDatesMode == false ){
        this.toasterService.error('Please select YES as the recurring frequency and continue selecting the multiple dates!')
      }
      else if(( this.daysSelected.length >= 1 && this.multipleDatesSelectionService.isRecurringDatesMode == true && (this.multipleDatesSelectionService.recurrencePattern.length == 0 ) )){
        this.toasterService.error('Please select any of the recurring frequencies and continue!')
      }
    }
  }

  else {
    this.daysSelected.splice(index, 1);
    this.daysSelectedDisplayed.splice(index, 1);
  }

  this.multipleDatesSelectionService.datesChosen = [...this.daysSelected];
  // this.datesChosen.emit()
  // this.dateChosen.emit(JSON.stringify(this.daysSelected))
  console.log("SELECTED DATES in the picker : ",this.daysSelected);
  this.daysSelectedDisplayed = [...this.daysSelected];
  
  calendar.updateTodaysDate();
}

}
