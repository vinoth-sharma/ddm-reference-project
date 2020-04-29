// import { Component, OnInit } from '@angular/core';
// import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { FormControl, FormGroupDirective, 
//          NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
// import { ErrorStateMatcher } from '@angular/material/core';

// @Component({
//   selector: 'app-date-picker',
//   templateUrl: './date-picker.component.html',
//   styleUrls: ['./date-picker.component.css']
// })
// export class DatePickerComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

//   // select from date
//   public startDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
//     this.targetStart = new Date(this.dateFormat(event.value)).toISOString();
//     this.customizedFromDate = this.dateFormat(event.value);
//     this.targetStartDate = new Date(event.value).getDate();
//     this.targetStartMonth = new Date(event.value).getMonth()+1;
//     this.markDates();
//   }

//   // select to date
//   public endDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
//     this.targetEndDate = new Date(event.value).getDate();
//     this.targetend = new Date(this.dateFormat(event.value)).toISOString();
//     this.customizedToDate  = this.dateFormat(event.value);
//     this.targetEndMonth = new Date(event.value).getMonth()+1;
//     this.markDates();
//   }

//     // heighligth background color dates from fromDate to endDate
//     public markDates(){
//       if(this.targetStartMonth && this.targetEndMonth) { 
//         this.dateClass = (d: Date): MatCalendarCellCssClasses => {
//           const date = d.getDate();
//           const m = d.getMonth()+1;
//           if(m === this.targetStartMonth && m === this.targetEndMonth) {
//                if(date > this.targetStartDate && date < this.targetEndDate) 
//                   return 'custom-date-class';
//           } else if(m >= this.targetStartMonth && m <= this.targetEndMonth) {
//               if(m > this.targetStartMonth && m < this.targetEndMonth) 
//                   return 'custom-date-class';
//               else if(m === this.targetStartMonth) {
//                   if(date > this.targetStartDate) 
//                     return 'custom-date-class';
//               } else if(m === this.targetEndMonth) {
//                       if(date < this.targetEndDate) 
//                         return 'custom-date-class';
//               }
//           }
//         };
//       }
//     }

//      // formating date 
//   public dateFormat(str:any) {
//     var date = new Date(str),
//       mnth = ("0" + (date.getMonth() + 1)).slice(-2),
//       day = ("0" + date.getDate()).slice(-2);
//     return [date.getFullYear(), mnth, day].join("-");
//   }

// }
