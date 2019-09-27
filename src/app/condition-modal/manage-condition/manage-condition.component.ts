import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { ConditionsService } from "../conditions.service";
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-manage-condition',
  templateUrl: './manage-condition.component.html',
  styleUrls: ['./manage-condition.component.css']
})
export class ManageConditionComponent implements OnInit {
  @Input() data;
  @Output() editCondition = new EventEmitter();
  constructor(private dialogRef: MatDialogRef<ManageConditionComponent>,
    private _formBuilder: FormBuilder,
    private conditionService :ConditionsService) {}

    conditionsList = [];
    enableDeleteConfirmationDialog:boolean = false;
    disableApplyBtn:boolean = false;
    selectedConditionToDel = null;

  ngOnInit() {
  }

  getExistingData(){
    this.conditionService.getExistingConditions(this.data).subscribe(res=>{
      // console.log(res);
      this.conditionsList = res.data;
    })
  }

  ngAfterViewInit() {
    this.getExistingData();
  }
  
  showConfirmationDilaog(data){
    // console.log(data);
    this.enableDeleteConfirmationDialog = true;
    this.selectedConditionToDel = data.condition_id;
  }


  deleteCondition(){
    this.disableApplyBtn = true;
    this.conditionService.deleteCondition(this.selectedConditionToDel).subscribe(res=>{
      // console.log(res);
      this.selectedConditionToDel = null;
      this.enableDeleteConfirmationDialog = false;
      this.disableApplyBtn = false; 
      this.getExistingData();

    })
  }

  emitEditCondition(data){
    data['type'] = 'edit';
    this.editCondition.emit(data);

  }

}
