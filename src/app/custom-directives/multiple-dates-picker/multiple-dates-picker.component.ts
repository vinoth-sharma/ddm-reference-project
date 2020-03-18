import { Component, OnInit, ViewEncapsulation, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { MultipleDatesSelectionService } from './multiple-dates-selection.service'

@Component({
  selector: 'app-multiple-dates-picker',
  templateUrl: './multiple-dates-picker.component.html',
  styleUrls: ['./multiple-dates-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MultipleDatesPickerComponent implements OnInit {

  // @Output() datesChosen = new EventEmitter();.emit()
  
  constructor( public multipleDatesSelectionService : MultipleDatesSelectionService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) {
    if('datesChosen' in changes){
      this.daysSelected = this.multipleDatesSelectionService.datesChosen;
    }
  }

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
    this.daysSelected.push(date);
    this.daysSelectedDisplayed.push(date);
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
