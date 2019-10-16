import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { ListOfValuesService } from '../list-of-values.service';

@Component({
  selector: 'app-lov-container',
  templateUrl: './lov-container.component.html',
  styleUrls: ['./lov-container.component.css']
})
export class LovContainerComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<LovContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService,
    private listOfValuesService: ListOfValuesService) { }

  selected = new FormControl(0);
  enableEditing: boolean = false;
  dataInject: boolean = true;
  editingData;
  values = [];
  createdLov = [];
  load: boolean = true;


  ngOnInit() {
   this.values = this.data.values;
   console.log(this.data);
   console.log(this.data.columnName);
   console.log(this.data.values); 
   this.getLovList();  
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

public getLovList() {
  this.load = true;
  let options = {};
  options["tableId"] = this.data['tableSelectedId'];
  options['columnName'] = this.data['columnName'];
  this.listOfValuesService.getLov(options).subscribe(res => {
    this.createdLov = res['data'];     
    console.log(this.createdLov,"lovContainer");         
    this.load = false;
  })
}

  enableEditingTab(data) {
    this.enableEditing = true;
    this.editingData = data;
    this.selected.setValue(2);
  }

  editingDone() {
    this.enableEditing = false;
    this.selected.setValue(1);
    this.editingData = {};
  }

}
