import { Component, OnInit, Inject, Input, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ReportViewService } from "../report-view.service";

@Component({
  selector: 'app-manage-table-parameters',
  templateUrl: './manage-parameters.component.html',
  styleUrls: ['./manage-parameters.component.css']
})
export class ManageTableParametersComponent implements OnInit {
  @Input() paramData:any;

  constructor(public dialogRef: MatDialogRef<ManageTableParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public reportService: ReportViewService) { }

    tableData:any = [];
    columnDetails:any = [];

    existingParamList = []
  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges){
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails
    console.log(this.columnDetails);
    console.log(this.tableData);
    this.existingParamList = [];
    
    this.tableData.parameter_list.forEach(element => {
      let obj = {
      appliedFlag : element.applied_flag,
      appliedValues : element.applied_values,
      columnUsed : element.column_used,
      defaultValues : element.default_value_parameter,
      description :element.description,
      parameterValues : element.parameter_formula,
      parameterName :element.parameter_name,
      parameterId :element.parameters_id,
      sheetId: element.report_sheet
      }
      this.existingParamList.push(obj)

    });
    
  }

}
