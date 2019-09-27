import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-condition-modal-wrapper',
  templateUrl: './condition-modal-wrapper.component.html',
  styleUrls: ['./condition-modal-wrapper.component.css']
})
export class ConditionModalWrapperComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConditionModalWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService) { }

  selected = new FormControl(0);
  enableEditing:boolean = false;
  editingData = {};

  ngOnInit() {
    console.log(this.data);
    
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
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
