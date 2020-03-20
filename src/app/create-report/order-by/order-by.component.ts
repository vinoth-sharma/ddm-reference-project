import { Component, OnInit } from '@angular/core';
import { SharedDataService } from "../shared-data.service";
import { SelectTablesService } from '../select-tables/select-tables.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-order-by',
  templateUrl: './order-by.component.html',
  styleUrls: ['./order-by.component.css']
})
export class OrderByComponent implements OnInit {
  public selectedTables: any = [];
  public orderbyData: orderbyRow[] = [{
    tableId: null,
    table: null,
    selectedColumn: null,
    columns: [],
    orderbySelected: null,
    columnDetails: []
  }]
  public orderbyType: any = ["ASC", "DESC"];
  public wholeResponse;
  public responseData;
  public checkColumn;
  public checkOrderby;
  public orderColumns;
  public formulaArray1: any = [];
  public columnWithTable;
  public originalColumns = [];
  public formula1;
  public columns: any = [];
  public tableSearch:string = '';
  constructor(public sharedDataService: SharedDataService, 
              private toastrService: NgToasterComponent, 
              private selectTablesService: SelectTablesService) { }

  ngOnInit() { 
    // to get the list of name of selected tables
   this.getSelectedTableData();
  }

  getSelectedTableData(){
      this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables);  
      // this.sharedDataService.setFormula(['orderBy'], '');
      this.columnWithTable = this.getColumns(this.selectedTables);
      this.orderbyData = this.getInitialState(this.columnWithTable);
      let formulaCalculated = this.sharedDataService.getOrderbyData();
      this.removeDeletedTableData(formulaCalculated);
      this.sharedDataService.resetQuerySeleted.subscribe(ele=> 
            this.orderbyData = this.getInitialState(this.columnWithTable) );
  }

  // to add new row for order by data
  public addRow() {
    this.orderbyData.push({
      tableId: null,
      table: null,
      columns: [],
      selectedColumn: null,
      orderbySelected: 'ASC',
      columnDetails: JSON.parse(JSON.stringify(this.columnWithTable))
    });
  }

  // delete selected row of order by data
  public removeDeletedTableData(data){
    let a = JSON.parse(JSON.stringify(this.selectedTables));
    for (let key in data) {
      if (!(this.selectedTables.find(table =>
        table['table']['select_table_id'].toString().includes(key)
      ))) {
        delete data[key];
      }
    }
    
    if(this.isEmpty(data))
      this.orderbyData = this.getInitialState(this.columnWithTable);
    else
      this.orderbyData = [];
      
    for(let d in data){
        this.orderbyData.push(...data[d]);
    }
    this.orderbyData.forEach(ele=>{
        ele.columnDetails = JSON.parse(JSON.stringify(this.columnWithTable))
    });
  }

  // checking if data is empty or not
  private isEmpty(data){
    for(let key in data){
      if(data.hasOwnProperty(key)){
        return false;
      }
    }
    return true;
  }

  public getColumns(selectedTables) {   //fetch columns for selected tables
    let columnData = [];
    let columnWithTable = [];
    if(selectedTables.length > 0){
      columnWithTable = selectedTables.map(element => {
        if(element && element['table'] && element['table']['column_properties']) {
          return element['table']['column_properties'].map(col => {
            if(element && element['select_table_alias']) {
              return `${element['select_table_alias']}.${col.column}`
            }
          });
        }
      });
      columnWithTable.forEach(data => {
        if(data) {
          columnData.push(...data);
        }
      });
    }
    return columnData;
  }

  // initial state of some of params
  public getInitialState(columnWithTable) {
    return [{
      tableId: null,
      table: null,
      selectedColumn: null,
      columns: [],
      orderbySelected: 'ASC',
      columnDetails: JSON.parse(JSON.stringify(columnWithTable)).sort()
    }];
  }

  // selected column or orderBy data
  public calculateFormula(index?: number) {
    this.checkColumn = this.orderbyData[index].selectedColumn;
    this.checkOrderby = this.orderbyData[index].orderbySelected;
    let formulaString = `${this.orderbyData[index].selectedColumn} ${this.orderbyData[index].orderbySelected}`;
    this.formulaArray1.splice(index, 1, formulaString)
    this.formula1 = this.formulaArray1.join(',');
    let aliasName = this.checkColumn.split('.')[0];
    let table = this.selectedTables.find(table =>
      table['select_table_alias'].toString().includes(aliasName)
    )
    this.orderbyData[index].tableId = table['tableId'];
  }

  // selected order by data is adding to formula bar
  public formula() {
    if (this.orderbyData[0].selectedColumn === null || this.orderbyData[0].orderbySelected === null) {
      this.sharedDataService.setFormula(['orderBy'], '');
      this.sharedDataService.setOrderbyData({});
      return;
    } else if ((this.orderbyData.find(obj => obj.selectedColumn === null)) || (this.orderbyData.find(obj => obj.orderbySelected === null))) {
      this.toastrService.error("All fields need to be filled");
      return;
    } else {
      this.sharedDataService.setFormula(['orderBy'], this.formula1);
      $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
      let orderByObj = this.orderbyData.reduce(function (rv, x) {
        (rv[x['tableId']] = rv[x['tableId']] || []).push(x);
        return rv;
      }, {});
      this.sharedDataService.setOrderbyData(orderByObj);
    }
  }

// delete row of selected deleted button of order by data
  public deleteRow(index: number) {
    if ((this.orderbyData.length - 1) == 0) {
      this.orderbyData = this.getInitialState(this.columnWithTable);
      // this.sharedDataService.setFormula(['orderBy'], '');
    } else {
      this.orderbyData.splice(index, 1);
      this.formulaArray1.splice(index, 1);
      this.formula1 = this.formulaArray1.join(',');
      // this.sharedDataService.setFormula(['orderBy'], this.formula1);
    }
  }

  // filter column for order by data
  public filterTable(event,i,flag){
    flag?event.stopPropagation():'';
    let str = event.target.value.trim();
    let l_filtered_data = [];
    if(str){
      l_filtered_data = this.columnWithTable.filter(column=>{
        let l_column = column.split(".")[1];
        if(l_column.toLowerCase().includes(str.toLowerCase()))
          return true
        else  
          return false
      })
    }else{
      l_filtered_data = this.columnWithTable.filter(ele=>true)
    }
    this.orderbyData[i].columnDetails = l_filtered_data;
  }


// after selecting column close selection options
  public opened(flag,i){
    if(!flag)
      this.filterTable({ target: { value:'' } },i,false)
    else{
      let element:any = document.getElementById("id_"+i);
      element.value = "";
    }
  }
}

export interface orderbyRow {
  tableId: number;
  table: any;
  columns: string[];
  selectedColumn: string;
  orderbySelected: string;
  columnDetails:string[];
}

