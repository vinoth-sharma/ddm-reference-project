import { Component, OnInit, SimpleChanges, Input, Inject } from '@angular/core';
import { ReportViewService } from '../report-view.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-edit-parameters',
  templateUrl: './edit-parameters.component.html',
  styleUrls: ['./edit-parameters.component.css']
})
export class EditParametersComponent implements OnInit {
 
  @Input() paramData: any;

  tableData: any = [];
  columnDetails: any = [];
  parameterValues = [];

  paraterNameExists: boolean = false;

  selected = {
    columnName: '',
    parameterValues: [],
    parameterName: '',
    defaultParamValue: '',
    desc: ''
  }

  parameterName = new FormControl('', [Validators.required])
  columnName = new FormControl('', [Validators.required])
  parameterValue = new FormControl('', [Validators.required])
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  enableCreateBtn: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }
  
    ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails
    // console.log(this.tableData);
  }
}
