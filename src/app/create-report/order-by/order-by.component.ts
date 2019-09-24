import { Component, OnInit } from '@angular/core';
import { SharedDataService } from "../shared-data.service";
import { SelectTablesService } from '../select-tables/select-tables.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-order-by',
  templateUrl: './order-by.component.html',
  styleUrls: ['./order-by.component.css']
})
export class OrderByComponent implements OnInit {
  public selectedTables: any = [];
  public orderbyData: orderbyRow[] = this.getInitialState();
  public orderbyType: any = ["ASC", "DESC"];
  public wholeResponse;
  public responseData;
  public checkColumn;
  public checkOrderby;
  public orderColumns;
  public formulaArray1: any = [];
  public columnWithTable;
  public formula1;
  public columns: any = [];
  constructor(private sharedDataService: SharedDataService, private toastrService: ToastrService, private selectTablesService: SelectTablesService) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => {
      this.sharedDataService.setFormula(['orderBy'], '');
      this.sharedDataService.setOrderbyData({});
      this.selectedTables = tables;
      this.columnWithTable = this.getColumns();
      let formulaCalculated = this.sharedDataService.getOrderbyData();
      this.removeDeletedTableData(formulaCalculated);
    })
    this.sharedDataService.resetQuerySeleted.subscribe(ele=>{
      this.orderbyData = this.getInitialState();
    })
  }

  public addRow() {
    this.orderbyData.push({
      tableId: null,
      table: null,
      columns: [],
      selectedColumn: null,
      orderbySelected: null
    });
  }

  public removeDeletedTableData(data) {
    for (let key in data) {
      if (!(this.selectedTables.find(table =>
        table['table']['select_table_id'].toString().includes(key)
      ))) {
        delete data[key];
      }
    }
    
    if(this.isEmpty(data)){
      this.orderbyData = this.getInitialState();
    }else{
      this.orderbyData = [];
    }
    
      for(let d in data){
          this.orderbyData.push(...data[d]);
        }
  }

  private isEmpty(data){
    for(let key in data){
      if(data.hasOwnProperty(key)){
        return false;
      }
    }
    return true;
      }

  public getColumns() {
    let columnData = [];
    let columnDataCheck = this.
    selectedTables.reduce((res, item) => (res.concat(item.columns.map(column => `a.${column}`))), []);
    // console.log(columnDataCheck);
    if (columnDataCheck[0] == 'a.all') {
     
      let columnWithTable = this.selectedTables.map(element => {
        return element['table']['mapped_column_name'].map(column => {
          return `${element['select_table_alias']}.${column}`
        });
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    return columnData;
  } else {
    columnData = this.selectedTables.reduce((res, item) => (res.concat(item.columns.map(column => `${item['select_table_alias']}.${column}`))), []);
    return columnData;
  }
   
  }

  private getInitialState() {
    return [{
      tableId: null,
      table: null,
      selectedColumn: null,
      columns: [],
      orderbySelected: null
    }];
  }

  onTableSelect(event, item) {
    item.columns = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.mapped_column_name;
  }

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

  public deleteRow(index: number) {
    if ((this.orderbyData.length - 1) == 0) {
      this.orderbyData = this.getInitialState();
      this.sharedDataService.setFormula(['orderBy'], '');
    } else {
      this.orderbyData.splice(index, 1);
      this.formulaArray1.splice(index, 1);
      this.formula1 = this.formulaArray1.join(',');
      this.sharedDataService.setFormula(['orderBy'], this.formula1);
    }
  }
}

export interface orderbyRow {
  tableId: number;
  table: any;
  columns: string[];
  selectedColumn: string;
  orderbySelected: string;
}
