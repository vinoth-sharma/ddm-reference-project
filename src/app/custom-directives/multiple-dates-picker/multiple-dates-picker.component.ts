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

  @Input() loadingDates : any = this.multipleDatesSelectionService.datesChosen || [];
  @Input() datePickerStatus : boolean = true;
  // @Output() datesChosen = new EventEmitter();.emit()
  
  constructor( public multipleDatesSelectionService : MultipleDatesSelectionService,
                public toasterService : NgToasterComponent) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges,calendar: any) {
    if('loadingDates' in changes){
      console.log('CHANGES seen in TODAYs date in loadingDates: ',changes);
      this.daysSelected = this.multipleDatesSelectionService.datesChosen;
      if(this.daysSelected.length && this.daysSelected.length ===1){
        this.daysSelected = [this.daysSelected];
      }
      this.daysSelectedDisplayed = this.daysSelected;
      console.log("this.datePickerStatus value in loadingDates changes",this.datePickerStatus);
      console.log("CHANGES in loadingDates changes :",changes);
      // this.datePickerStatus = true;
      this.datePickerStatus = changes.datePickerStatus.currentValue;
      if(this.datePickerStatus === undefined || null || ''){
        this.datePickerStatus = true;
      }
      console.log("this.datePickerStatus value NOWW in loadingDates changes",this.datePickerStatus);
      if(this.daysSelected && this.daysSelected.length){
        calendar.updateTodaysDate();
      }
      
    }
    // if('datePickerStatus' in changes){
    //   this.datePickerStatus = changes.datePickerStatus.currentValue || true; //wrong
    //   console.log("this.datePickerStatus value in datePicker changes",this.datePickerStatus);
    //   console.log("CHANGES in datePicker changes :",changes);
    // }
  }

public daysSelected: any = [];
public daysSelectedDisplayed: any = [];
event: any;

isSelected = (event: any) => {
  const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

  if(this.daysSelected && ( typeof(this.daysSelected) == 'string')){
    this.daysSelected = [this.daysSelected];
    this.daysSelectedDisplayed = [this.daysSelected];
  }

  return this.daysSelected.find(x => x == date) ? "selected" : null;
};

select(event: any, calendar: any) {
  const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

  if(this.daysSelected && ( typeof(this.daysSelected) == 'string')){
    this.daysSelected = [this.daysSelected];
    this.daysSelectedDisplayed = [this.daysSelected];
  }

  const index = this.daysSelected.findIndex(x => x == date);

  if (index < 0) {
    if(( this.daysSelected.length == 0 && this.multipleDatesSelectionService.isRecurringDatesMode == false ) || ( this.daysSelected.length >= 0 && this.multipleDatesSelectionService.isRecurringDatesMode == true && ( this.multipleDatesSelectionService.recurrencePattern.length != 0) )){
      // this.multipleDatesSelectionService.recurrencePattern != null && this.multipleDatesSelectionService.recurrencePattern != undefined &&
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
      else if(( this.daysSelected.length >= 0 && this.multipleDatesSelectionService.isRecurringDatesMode == true && (this.multipleDatesSelectionService.recurrencePattern.length == 0 ) )){
        this.toasterService.error('Please select any of the recurring frequencies and continue!')
      }
    }
  }

  else {
    this.daysSelected.splice(index, 1);
    this.daysSelectedDisplayed.splice(index, 1);
  }


  this.daysSelected = this.removeDuplicates(this.daysSelected);
  this.multipleDatesSelectionService.datesChosen = [...this.daysSelected];
  // this.multipleDatesSelectionService.datesChosen = this.removeDuplicates(this.daysSelected);
  // this.datesChosen.emit()
  // this.dateChosen.emit(JSON.stringify(this.daysSelected))
  console.log("SELECTED DATES in the picker : ",this.daysSelected);
  this.daysSelectedDisplayed = [...this.daysSelected];
  
  calendar.updateTodaysDate();
}

public removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b)
};

}
