import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConditionsService } from "../conditions.service";

@Component({
  selector: 'app-condition-modal-wrapper',
  templateUrl: './condition-modal-wrapper.component.html',
  styleUrls: ['./condition-modal-wrapper.component.css']
})
export class ConditionModalWrapperComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConditionModalWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService,
    private conditionService: ConditionsService) { }

  selected = new FormControl(0);
  enableEditing:boolean = false;
  dataInject:boolean = true;
  editingData = {};
  conditionsList = [];

  ngOnInit() {
    // console.log(this.data);
    this.conditionService.dataLoading.subscribe((res:any)=>{
      this.dataInject = !res;
    })
    this.getExistingData();
  }

  enableEditingTab(data){
    this.enableEditing = true;
    this.selected.setValue(2);
    this.editingData = data;
  }

  editingDone(){
    this.enableEditing = false;
    this.selected.setValue(1);
    this.editingData = {};
    this.getExistingData();
  }

  creatingDone(){
    this.getExistingData();
  }

  getExistingData(){
    this.conditionService.getExistingConditions(this.data).subscribe(res=>{
      // console.log(res);
      this.conditionsList = res.data;
    })
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
