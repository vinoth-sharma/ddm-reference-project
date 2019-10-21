import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParametersService } from "../parameters.service";

@Component({
  selector: 'app-parameters-container',
  templateUrl: './parameters-container.component.html',
  styleUrls: ['./parameters-container.component.css']
})
export class ParametersContainerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ParametersContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService,
    private parameterService: ParametersService) { }

  selected = new FormControl(0);
  enableEditing: boolean = false;
  dataInject: boolean = true;
  editingData;

  ngOnInit() {
    this.parameterService.dataLoading.subscribe((res: any) => {
      this.dataInject = !res;
    })
    // console.log(this.data);

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

  closeDailog(): void {
    this.dialogRef.close();
  }
}
