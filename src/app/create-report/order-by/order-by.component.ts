import { Component, OnInit } from '@angular/core';
import { SharedDataService } from "../shared-data.service";
import { SelectTablesService } from '../select-tables/select-tables.service';
import { ToastrService } from "ngx-toastr";
import Utils from "../../../utils";


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
  public formulaFinal;
  public checkColumn;
  public checkOrderby;
  public orderColumns;
  public formulaArray1: any = [];
  public columnWithTable;
  public formula1;
  public columns: any = [];
  constructor(private sharedDataService: SharedDataService, private toastrService: ToastrService  , private selectTablesService: SelectTablesService) { }

  ngOnInit() {

    this.sharedDataService.selectedTables.subscribe(tables => {
      this.selectedTables = tables;
      this.columnWithTable = this.getColumns();

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

  public getColumns() {
    let columnData = [];
    if (this.selectedTables.length) {
      columnData = this.selectedTables.reduce((res, item) => (res.concat(item.columns.map(column => `${item['select_table_alias']}.${column}`))), []);
    }
    console.log(columnData);
    return columnData;
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
    console.log("item.columns", item.columns);
  }

  public calculateFormula(index?: number) {
    this.checkColumn = this.orderbyData[index].selectedColumn ;
    this.checkOrderby = this.orderbyData[index].orderbySelected;
    let formulaString = `${this.orderbyData[index].selectedColumn} ${this.orderbyData[index].orderbySelected}`;
    this.formulaArray1.splice(index, 1, formulaString)
    this.formula1 = this.formulaArray1.join(',');
  }

  public formula(i) {
    if(!this.checkColumn || !this.checkOrderby) {
     this.toastrService.error("All fields need to be filled");
    } else {
    this.formulaFinal = this.formula1;
    this.sharedDataService.setOrderbyData(['orderBy'] , this.formulaFinal);
  }
  }

  public deleteRow(index: number) {
    this.orderbyData.splice(index,1);
    this.formulaArray1.splice(index, 1);
    this.formula1 = this.formulaArray1.join(',');
  }

}
export interface orderbyRow {
  tableId: number;
  table: any;
  columns: string[];
  selectedColumn: string;
  orderbySelected: string;
}
