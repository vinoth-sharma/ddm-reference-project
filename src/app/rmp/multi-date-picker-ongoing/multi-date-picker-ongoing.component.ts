import { Component, OnInit, ViewEncapsulation, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { NgToasterComponent } from "../../custom-directives/ng-toaster/ng-toaster.component";

import { MultiDatePickerOngoingService } from './multi-date-picker-ongoing.service'

@Component({
  selector: 'app-multi-date-picker-ongoing',
  templateUrl: './multi-date-picker-ongoing.component.html',
  styleUrls: ['./multi-date-picker-ongoing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MultiDatePickerOngoingComponent implements OnInit {

  @Input() loadingDates: any = this.MultiDatePickerOngoingService.datesChosen || [];
  @Input() datePickerStatus: boolean = true;

  constructor(public MultiDatePickerOngoingService: MultiDatePickerOngoingService,
    public toasterService: NgToasterComponent) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges, calendar: any) {
    if ('loadingDates' in changes) {
      this.daysSelected = this.MultiDatePickerOngoingService.datesChosen;
      if (this.daysSelected.length && this.daysSelected.length === 1) {
        this.daysSelected = [this.daysSelected];
      }
      this.daysSelectedDisplayed = this.daysSelected;
      this.datePickerStatus = changes.datePickerStatus.currentValue;
      if (this.datePickerStatus === undefined || null || '') {
        this.datePickerStatus = true;
      }
      if (this.daysSelected && this.daysSelected.length) {
        calendar.updateTodaysDate();
      }
    }
  }

  public daysSelected: any = [];
  public daysSelectedDisplayed: any = [];
  event: any;

  isSelected = (event: any) => {
    if (event !== undefined) {
      const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

      if (this.daysSelected && (typeof (this.daysSelected) == 'string')) {
        this.daysSelected = [this.daysSelected];
        this.daysSelectedDisplayed = [this.daysSelected];
      }

      return this.daysSelected.find(x => x == date) ? "selected" : null;
    }
  };


  select(event: any, calendar: any) {
    if (event !== undefined) {
      const date = ("00" + (event.getMonth() + 1)).slice(-2) + "/" + ("00" + event.getDate()).slice(-2) + "/" + event.getFullYear();

      if (this.daysSelected && (typeof (this.daysSelected) == 'string')) {
        this.daysSelected = [this.daysSelected];
        this.daysSelectedDisplayed = [this.daysSelected];
      }

      const index = this.daysSelected.findIndex(x => x == date);

      if (index < 0) {
        if ((this.daysSelected.length == 0 && this.MultiDatePickerOngoingService.isRecurringDatesMode == false) || (this.daysSelected.length >= 0 && this.MultiDatePickerOngoingService.isRecurringDatesMode == true && (this.MultiDatePickerOngoingService.recurrencePattern.length != 0))) {
          if (this.MultiDatePickerOngoingService.recurrencePattern == '1') {
            this.daysSelected = [this.MultiDatePickerOngoingService.datesChosen[0]];
            this.daysSelectedDisplayed = [...this.daysSelected];
          }
          this.daysSelected.push(date);
          this.daysSelectedDisplayed.push(date);
        }
        else {
          if (this.daysSelected.length == 1 && this.MultiDatePickerOngoingService.isRecurringDatesMode == false) {
            this.toasterService.error('Please select YES as the recurring frequency and continue selecting the multiple dates!')
          }
          else if ((this.daysSelected.length >= 0 && this.MultiDatePickerOngoingService.isRecurringDatesMode == true && (this.MultiDatePickerOngoingService.recurrencePattern.length == 0))) {
            this.toasterService.error('Please select any of the recurring frequencies and continue!')
          }
        }

      }

      else {
        this.daysSelected.splice(index, 1);
        this.daysSelectedDisplayed.splice(index, 1);
      }

      this.daysSelected = this.removeDuplicates(this.daysSelected);
      this.MultiDatePickerOngoingService.datesChosen = [...this.daysSelected];
      this.daysSelectedDisplayed = [...this.daysSelected];

      calendar.updateTodaysDate();

    }
  }

  public removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
  };

}
