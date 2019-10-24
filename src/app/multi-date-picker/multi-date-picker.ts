import {Component,Input,Output,EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MultiDateService } from '../multi-date-picker/multi-date.service'
import { ToastrService } from 'ngx-toastr';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'ngb-multi-date-picker',
  templateUrl: 'multi-date-picker.html',
  styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
    .custom-day.selected{  
      background-color: rgba(255, 255, 0, .5);
        
    }
  `]
})
export class MultiDatePicker implements OnInit, OnChanges {

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  index:any;

  _datesSelected:NgbDateStruct[]=[]; 

  @Input()
  set datesSelected(value:NgbDateStruct[])  
  {
     this._datesSelected=value;
  }
  get datesSelected():NgbDateStruct[]
  {
    return this._datesSelected?this._datesSelected:[];
  }

  @Output() datesSelectedChange=new EventEmitter<NgbDateStruct[]>();

  constructor(calendar: NgbCalendar,
              private multiDateService: MultiDateService,
              public toasterService: ToastrService) {
  }

  ngOnInit() {
    // write logic to nullify old selections colors??
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onDateSelection(event:any,date: NgbDateStruct) {

    event.target.parentElement.blur();  //make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey==true && this.multiDateService.dateMode === true ){  //If is CrtlKey pressed
        this.fromDate = date;
      }
      else if(event.ctrlKey==true && this.multiDateService.dateMode === false ){
        this.toasterService.error("Select any of the recurring frequencies to continue with MULTIPLE DATES")
        this.toasterService.error("Please select 'Recurring frequency' as YES and ....");
      }
      else
        this.addDate(date);

      this.datesSelectedChange.emit(this.datesSelected);

    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate,this.toDate);
      this.fromDate=null;
      this.toDate=null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date:NgbDateStruct)
  {
      this.index=this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year);
      if( (this.multiDateService.dateMode === false && (this.datesSelected.length === 0 || this.datesSelected.length === 1 ) ) || 
          (this.multiDateService.dateMode === true && this.datesSelected.length >= 0) ){
      if (this.index>=0){     //If exist, remove the date
        this.datesSelected.splice(this.index,1)
      }
      else if(this.multiDateService.dateMode === false && this.datesSelected.length >= 1){
          this.toasterService.error("Select any of the recurring frequencies to continue with MULTIPLE DATES")
          this.toasterService.error("Please select 'Recurring frequency' as YES and ....");
      }
      else{   //a simple push
        this.datesSelected.push(date);}
      }
    }
    addRangeDate(fromDate:NgbDateStruct,toDate:NgbDateStruct)
    {
        //We get the getTime() of the dates from and to
        let from=new Date(fromDate.year+"-"+fromDate.month+"-"+fromDate.day).getTime();
        let to=new Date(toDate.year+"-"+toDate.month+"-"+toDate.day).getTime();
        for (let time=from;time<=to;time+=(24*60*60*1000)) //add one day
        {
            let date=new Date(time);
            //javascript getMonth give 0 to January, 1, to February...
            this.addDate({year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()});
        }   
        this.datesSelectedChange.emit(this.datesSelected);
    }
    //return true if is selected
    isDateSelected(date:NgbDateStruct)
    {
        return (this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year)>=0);
    }
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
}
