import { Component, OnInit, Inject, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReportViewService } from '../report-view.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-clone-parameters',
  templateUrl: './clone-parameters.component.html',
  styleUrls: ['./clone-parameters.component.css']
})
export class CloneParametersComponent implements OnInit {

  @Input() paramData: any;
  @Output() exitCloneParameter = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<CloneParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }

  tableData: any = [];
  columnDetails: any = [];
  // parameterValues = [];
  sheetLevelData:any = {
    tableData : [],
    columnDetails : [],
    parameterList : []
  }

  sheetList = [];
  
  selectedParameter:any = {};

  parameterSelectedFlag:boolean = false;
  parameterValid:boolean = true;
  parameterNameExists:boolean = false;
  parameterReceivedFlag:boolean = false;

  sheetName = new FormControl('', [Validators.required]);
  parameterName = new FormControl('', [Validators.required]);

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.tableData = this.paramData.tableData
    this.columnDetails = this.paramData.columnDetails;
    this.sheetList = this.reportService.getSheetDetailsCurrentReport()
  }

  sheetSelected(event){
    //when sheet reselected made empty
    this.selectedParameter = {};
    this.parameterSelectedFlag = false;
    this.parameterValid = true;
    this.parameterReceivedFlag = false;
    this.sheetLevelData.tableData = []
    this.sheetLevelData.parameterList = []
    this.sheetLevelData.columnDetails = [];

    let obj = {
      sheetId : event.value
    }

    this.reportService.getReportDataFromHttp('', 'asc', 0, 5, obj, 0).subscribe((res:any) => {
    // console.log(res);
    this.sheetLevelData.parameterList = res.parameter_list;
    this.sheetLevelData.tableData = res;
    //  console.log(this.tableData);
    if(this.sheetLevelData.tableData.column_properties){
      this.sheetLevelData.columnDetails = this.sheetLevelData.tableData.column_properties.map(col => {
        return { columnName: col.mapped_column, dataType: col.column_data_type }
      })
    }
    else{
      this.sheetLevelData.columnDetails = this.sheetLevelData.tableData.data.sql_columns.map(col => {
        return { columnName: col, dataType: '' }
      })
    }
    this.parameterReceivedFlag = true;
  
    })

  }

  parameterSelected(event){
    this.selectedParameter = JSON.parse(JSON.stringify(this.sheetLevelData.parameterList.filter(para=>para.parameters_id === event.value)[0]))
    this.parameterSelectedFlag = true;
    this.parameterValid = true;
    this.checkColumnType()
  }
  
  checkColumnType(){
    this.parameterValid = this.columnDetails.some(col=>col.columnName === this.selectedParameter.column_used)
  }

  parameterNameInput(event){
    this.selectedParameter.parameter_name = event;
    this.parameterNameExists = this.tableData.parameter_list.some(parameter=>{
      return parameter.parameter_name === this.selectedParameter.parameter_name
    })
  }


  cloneParameter(str){
    let obj= {
      data : JSON.parse(JSON.stringify(this.selectedParameter)),
      type : str
    }
    if(str === 'edit' && !this.parameterValid){
      obj.data.column_used = ''
    }
    this.exitCloneParameter.emit(obj)
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
