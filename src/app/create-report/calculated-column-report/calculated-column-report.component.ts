import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CalculatedColumnReportService } from './calculated-column-report.service';
import { SharedDataService } from '../shared-data.service';
import { sqlFunctions } from '../../../constants';

@Component({
  selector: 'app-calculated-column-report',
  templateUrl: './calculated-column-report.component.html',
  styleUrls: ['./calculated-column-report.component.css']
})
export class CalculatedColumnReportComponent implements OnInit {

  public columns: any = [];
  public selectedColumns: any = [];
  public selectedParamList: any = [];
  public selectedParam: string;
  public parameters: any = [];
  public formulaColumns: any = [];
  public columnNames: string;
  public selected: string;
  public category: string;
  public paramConditionList: any = [];
  public selectedConditionList: any = [];
  public functionsList = sqlFunctions;
  
  constructor( private toasterService: ToastrService,
               private calculatedColumnReportService:CalculatedColumnReportService,
               private sharedDataService:SharedDataService ) { }

  ngOnInit() {
    this.reset();
    this.getParameters();
  }

  public getParameters() {
    let tableUsed = ['XYZ','MNO'];
    let data = {
      table_used : tableUsed
    }
    this.calculatedColumnReportService.getParameterList(data).subscribe(
      res => {
        let params = [];
        this.paramConditionList = res['data'];
        this.paramConditionList.forEach(element => {
          params.push(element['parameter_name']);
        });
        this.parameters = params;
      },
      err => {
        this.paramConditionList = [];
      }
    )
  };

  public setCategory(category: string) {
    this.category = category;
  }

  public onSelect(selected: string) {
    if (selected) {
      if(this.isColumn(selected)) {
        if (!this.selectedColumns.includes(selected))
          this.selectedColumns.push(selected);
      } else if(this.isParam(selected)) {
        if (!this.selectedParamList.includes(selected)) {
          this.selectedParamList.push(selected);
          this.paramConditionList.forEach(element => {
          if(selected == element['parameter_name'])
            this.selectedConditionList.push(element['parameter_formula']);
          });
        }
      } else
        this.toasterService.error('Parameter/Column already selected');
    } else {
        this.toasterService.error('Please select a valid Parameter/Column');
    }
    
    this.selected = '';
    this.selectedParam = '';
  }

  public deleteSelected(index: number, isColumn?:boolean) {
    let selected;
    if(isColumn)
      selected = this.selectedColumns.splice(index, 1).shift()
    else {
      selected = this.selectedConditionList.splice(index, 1).shift();
      this.selectedParamList.splice(index, 1);
    }
    if (this.formulaColumns.includes(selected)) {
      this.deleteFormulaColumn();
    }
  }

  public deleteFormulaColumn() {
    this.formulaColumns = [];
  }

  public isColumn(item: string) {
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  public isParam(item: string) {
    return this.parameters.map(param => param.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  public getColumns() {
    let columnData = [];
    let selectedTables = this.sharedDataService.getSelectedTables();

    selectedTables.forEach(element => {
      element['columns'].forEach(columns => {
        columnData.push(columns);
      }); 
    });
    
    return columnData;
  }


  public addToFormula(item: string) {
    let lastItem = this.formulaColumns[this.formulaColumns.length - 1]
    if(this.isParam(item)) {
      item = this.getCondition(item).parameter_formula;
    }
    if (item === lastItem) {
      this.toasterService.error('Please select a different column/function');
      return;
    }
    this.formulaColumns.push(item);
  }


  public getCondition(item:any) {      
    return this.paramConditionList.find(element => { 
      return element['parameter_name'] == item;
    });
  }

  public reset() {
    this.columns = this.getColumns();
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnNames = '';
    this.selected = '';
    this.category = 'mathematical';
  }
}