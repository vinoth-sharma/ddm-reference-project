import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { MultiDatesService } from '../multi-dates-picker/multi-dates.service'

@Component({
  selector: 'app-multi-dates-picker',
  templateUrl: './multi-dates-picker.component.html',
  styleUrls: ['./multi-dates-picker.component.css']
})
export class MultiDatesPickerComponent implements OnInit {

  public dateValue : string;
  public calendarHide : boolean;
  public values : any = [];
  
  constructor(private multiDatesService: MultiDatesService) { }

  ngOnInit() {
    this.calendarHide = true;
  }

  datesSelected:NgbDateStruct[]=[]; 

  change(value:NgbDateStruct[]){ 
    if(value.length){
      this.datesSelected=value;
      this.dateValue = this.datesSelected[0].month + '/' + this.datesSelected[0].day + '/' + this.datesSelected[0].year;
      this.values = [];
      this.datesSelected.forEach(element => {
        if(element.month === undefined ){ return }
        this.values.push((element.month + '/' + element.day + '/' + element.year).toString());
      });
    }
    else{
      this.values = [];
    }
    this.multiDatesService.sendingDates = this.values;
    console.log("this.multiDatesService.sendingDates VALUES:",this.multiDatesService.sendingDates)
  }

  public hideCalendar(){
  console.log("HIDECALENDAR CALLED!");
  this.calendarHide = !this.calendarHide;
  console.log("this.calendarHide value",this.calendarHide);
  }

  public seeingDates(){
    console.log("LOGGED DATES:",this.values);
  }
}
