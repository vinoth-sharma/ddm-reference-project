import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedDataService } from '../shared-data.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.css']
})
export class GenerateReportModalComponent implements OnInit {

  @Output() public saveData = new EventEmitter();



  saveAsName: FormControl = new FormControl();
  descForm:  FormControl = new FormControl();

  constructor(private sharedDataService:SharedDataService) { }

  ngOnInit() {
    this.saveAsName.setErrors(null);
    this.saveAsName.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        this.checkDuplicate(value);
        
      });
  }

  ngOnChanges(){
    this.reset();
  }

   /**
   * reset data
   */
  public reset() {
    this.saveAsName.setValue("");
    this.descForm.setValue("");
  }

  public checkDuplicate(value){
      let list = this.sharedDataService.getReportList();
      let duplicate = list.map(col => col.trim())
      .includes(value.trim());

if(duplicate)
      this.saveAsName.setErrors({'incorrect': false})
else
      this.saveAsName.setErrors(null)
  }

  /**
   * update Data
   */
  public updateData(){
    let data = {
      'name':this.saveAsName.value,
      'desc':this.descForm.value
    }
    this.saveData.emit(data);
  }
}
