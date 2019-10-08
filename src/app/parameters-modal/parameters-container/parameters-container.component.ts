import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parameters-container',
  templateUrl: './parameters-container.component.html',
  styleUrls: ['./parameters-container.component.css']
})
export class ParametersContainerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ParametersContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService) { }

  selected = new FormControl(0);
  enableEditing:boolean = false;
  dataInject:boolean = true;

  ngOnInit() {
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
