import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import Utils from "../../../utils";

import { SharedDataService } from "../shared-data.service";
import { aggregations } from '../../../constants';
import { SelectTablesService } from '../select-tables/select-tables.service';

@Component({
  selector: 'app-apply-aggregations',
  templateUrl: './apply-aggregations.component.html',
  styleUrls: ['./apply-aggregations.component.css']
})

export class ApplyAggregationsComponent implements OnInit {
  public groupByData: groupByRow[] = [{
    tableId: null,
    table: null,
    selectedColumn: null,
    columns: [],
    functions: [],
    selectedFunction: null
  }];
  public aggregatedColumnsToken = '';
  public formula: string;
  public formula1: string = "";
  public formulaArray1: any = [];
  public columns: any = [];
  public responseData: any = [];
  chosenTable; chosenId;
  public selectedTables: any = [];
  public tables: any = [];
  oldValue: any;
  public selectedTables2: any;
  results: any[] = [];
  current;
  columnWithTable: any = [];
  bracketStack: any = {
    'open': [],
    'close': []
  };
  isError: boolean;
  private isNew: boolean = true;
  public chips = [];
  existingList: any[] = [];
  wholeResponse: any;
  queryTextarea: FormControl = new FormControl();
  columnName: FormControl = new FormControl();
  keyChips = [];

  private functions = aggregations;

  constructor(private toasterService: ToastrService,
    private sharedDataService: SharedDataService,
    private selectTablesService: SelectTablesService) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
      this.columnWithTable = this.getColumns();
    })
    this.aggregatedColumnsToken = " ";
    // After changing the tables,we have to change the update the respective changed values but in auto suggest part,it is difficult to
    // handle the formula
  }
  public getColumns() {
    let columnData = [];
    console.log(this.selectedTables);
    this.selectedTables.forEach(element => {
      columnData = columnData.concat(element.columns.map(column => `${element['table']['select_table_name']}.${column}`));
    });
    return columnData;
  }

  onTableSelect(selected: any, i: number) {
    let data = {
      table_id: selected['table']['select_table_id'],
      table_type: 'custom_table_id' in selected['table'] ? 'custom_table' : 'mapped_table'
    }
    this.chosenTable = selected['table']['select_table_name'];
    // this.chosenId = selected['table']['select_table_id'];
    this.groupByData[i].tableId = selected['table']['select_table_id'];
    console.log("CHOSEN TABLE-", this.chosenTable, "CHOSEN VALUE", this.chosenId)
    Utils.showSpinner();
    this.selectTablesService.getColumns(data).subscribe(response => {
      this.responseData = response;
      this.wholeResponse = this.responseData['data'];
      this.groupByData[i].columns = this.wholeResponse.map(item => item.mapped_column);
      Utils.hideSpinner();
    }, error => {
      // console.log("ERROR OCCURING", error);
    })
  }

  public calculateFormula(index?: number) {
    if (this.groupByData[index].table == null) {
      this.calculateFormula1(index);
    }
    let formulaString = `${this.aggregatedColumnsToken}`;
    this.formula = formulaString;
    this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.formula1;
  }

  public calculateFormula1(index?: number) {  // calculates the group by part of the apply-aggregations
    if (this.groupByData[index].table && this.groupByData[index].selectedColumn) {
      if (this.groupByData[index].selectedFunction) {
        let formulaString = `${this.groupByData[index].selectedFunction}(${this.groupByData[index].table.table.select_table_name}.${this.groupByData[index].selectedColumn})`;
        this.formulaArray1.splice(index, 1, formulaString);
      }
      else {
        let formulaString = `${this.groupByData[index].table.table.select_table_name}.${this.groupByData[index].selectedColumn}`;
        this.formulaArray1.splice(index, 1, formulaString);
      }
      this.formula1 = this.formulaArray1.join(',');
    }
  }

  public addRow() {
      this.groupByData.push({
        tableId: null,
        table: null,
        columns: [],
        selectedColumn: null,
        functions: [],
        selectedFunction: null
      });
  }

  public deleteRow(index: number) {
      this.groupByData.splice(index, 1);
      this.formulaArray1.splice(index, 1);
      this.formula1 = this.formulaArray1.join(',');
      this.formula = this.formula1 + "," + this.formula + " GROUP BY " + this.formula1;
  }

  public apply() {
    if (this.groupByData[0].table != null || this.aggregatedColumnsToken.length != 0) {
      if (this.groupByData[0].table != null && this.aggregatedColumnsToken.length != 0) {
        let temp = [];
        temp.push(this.formula1, this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['groupBy'], this.formula1);
        // return;
      }
      else if (this.groupByData[0].table == null && this.aggregatedColumnsToken.length != 0) {
        let temp = [];
        temp.push(this.aggregatedColumnsToken)
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], this.formula1);
        // return;
      }
      else if (this.aggregatedColumnsToken.length === 0) {
        let temp = [];
        temp.push(this.formula1)
        this.sharedDataService.setFormula(['select', 'tables'], []);
        this.sharedDataService.setFormula(['select', 'aggregations'], temp);
        this.sharedDataService.setFormula(['groupBy'], temp);
      }
    }
    console.log("CD calles")
    let cD = this.getKeyWise();
    console.log(cD,'key value');
    
  }

  public inputValue(value, i) {
    this.aggregatedColumnsToken = value;
    if ((value || '').trim()) {
      this.oldValue = value.split(/[ .]/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + '';
      });
      this.current = this.oldValue[this.oldValue.length - 1];
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1]);
    } else {
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }];
    }
    this.calculateFormula(i);
  }

  private getSearchedInput(value: any) {
    let functionArr = [], columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    this.columnWithTable.forEach(columns => {
      columnList = columnList.concat(columns);
    });
    columnList = columnList.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    return [{ groupName: 'Functions', values: functionArr }, { groupName: 'Columns', values: columnList },
    { groupName: 'Tables', values: [...new Set(this.selectedTables.map(item => item.table.select_table_name))].filter((table: string) => table.toLowerCase().includes(value.toLowerCase())) }];
  }

  public onSelectionChanged(event, i) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0 ? this.oldValue.length - 1 : 0;
    this.oldValue[index] = event.option.value + '  ';
    this.setTextareaValue(this.oldValue.join(' '));

    if (event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if (event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);
    this.hasError();
    this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0], 'formula');
  }

  private setTextareaValue(value) {
    this.queryTextarea.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      if (this.bracketStack['open'].length === this.bracketStack['close'].length) {
        this.isError = false;
      }
      else {
        this.isError = true;
      }
    }
  };

  public checkDuplicate(value, type) {
    if ((value || '').trim() && this.isNew) {
      let currentList = this.chips.filter((element, key) => {
        if (type === 'column') {
          return value.toLowerCase() === element['name'].toLowerCase();
        } else {
          return value.toLowerCase() === element['formula'].toLowerCase();
        }
      });
      let existingList = this.existingList.filter(element => {
        if (type === 'column') {
          return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
        } else {
          return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
        }
      });

      if (currentList.length > 0 || existingList.length > 0) {
        type === 'column' ? this.columnName.setErrors({ 'incorrect': false }) : this.queryTextarea.setErrors({ 'incorrect': false });
      } else {
        type === 'column' ? this.columnName.setErrors(null) : this.queryTextarea.setErrors(null);
      }

    } 
    else{
      type === 'column' ? this.columnName.setErrors(null) : this.queryTextarea.setErrors(null);
      this.isNew = true;
    }
  }

  public populateAggregations(columnValue: string, i) {
    const columnData = this.wholeResponse.filter(item => item.mapped_column === columnValue)[0];
    if (columnData.data_type === 'DATE') {
      // this.aggregationData.availableFunctions[i] = aggregations.levels;
      this.groupByData[i].functions = aggregations.levels;
    } else {
      // this.aggregationData.availableFunctions[i] = aggregations.aggregationIndividual;
      this.groupByData[i].functions = aggregations.aggregationIndividual;
    }
  }

  public populateSendingData() {
    console.log("AGGREGATION DATA", this.groupByData);
  }

  private getKeyWise(){
    console.log(this.chips,'chips in getKeyWise');
     return this.groupByData.reduce(function(rv, x){
       (rv[x['tableId']] = rv[x['tableId']] || []).push(x);
       return rv;

     }, {});

  };

}

export interface groupByRow{
  tableId: number;
  table: any;
  columns: string[];
  selectedColumn: string;
  functions: string[];
  selectedFunction: string;
}