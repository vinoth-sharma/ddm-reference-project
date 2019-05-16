import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ParametersService } from '../parameters/parameters.service';

@Component({
  selector: 'app-table-cont',
  templateUrl: './table-cont.component.html',
  styleUrls: ['./table-cont.component.scss']
})

export class TableContComponent implements OnInit {
  @Input() tableData;

  @Input() columns: string[];
  // @Input() tableRowIdentifier: string | number;
  // @Output() clicked = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  column: string = '';
  // orderType: string = '';
  // currentColumn: string = '';
  searchItem: string = '';
  originalTableData = [];
  searchData = [];
  public dataSource;

  constructor(private parametersService:ParametersService) { }

  ngOnInit() {
    this.column = this.columns[0];
    this.searchData.length = this.columns.length;
    this.dataSource = new MatTableDataSource(this.tableData);
    this.originalTableData = this.tableData.slice();

    this.parametersService.paramTables.subscribe(tableList => {
      this.dataSource = new MatTableDataSource(tableList);
      this.dataSource.sort = this.sort;    
      this.dataSource.paginator = this.paginator; 
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;    
    this.dataSource.paginator = this.paginator;    
  }

  // handleClick(tableRowIdentifier) {
  //   this.clicked.emit(tableRowIdentifier);
  // }

  ngOnChanges(){
    // this.column = this.columns[0];
    // this.searchData.length = this.columns.length;
    // this.dataSource = new MatTableDataSource(this.tableData);
    // this.dataSource = new MatTableDataSource(this.tableData);
    // this.dataSource.sort = this.sort;    
    // this.dataSource.paginator = this.paginator;  
    // this.originalTableData = this.tableData.slice();
  }

  /**
  * sort
  */
  // public sort(col) {
  // public sortCols(col) {
  //   this.column = col.replace(/\s/g, "_");
  //   if (this.currentColumn === col) {
  //     this.orderType = !this.orderType ? 'desc' : '';
  //   } else {
  //     this.orderType = '';
  //   }
  //   this.currentColumn = col;
  // }

  public search(col) {   
    this.tableData = this.originalTableData;

    let value = this.searchItem;
    this.tableData = this.tableData.filter(element => {
      return (element[col] + '').toLowerCase().includes((value + '').toLowerCase())
    });
    // this.updateData(this.tableData);
    this.dataSource.data = this.tableData;
  }

  public isSearchable(i) {
    if (this.searchData[i]) {
      if (this.searchData[i]['isSearchable']) {
        this.searchData[i]['isSearchable'] = false;
      } else {
        this.searchData.forEach((element, key) => {
          element['isSearchable'] = key === i ? true : false;
        });
        this.searchItem = '';
      }
      this.tableData = this.originalTableData;
      // this.updateData(this.tableData);
      this.dataSource.data = this.tableData;
      this.autoFocus();
    } else {
      this.searchData.forEach((element, key) => {
        element['isSearchable'] = false;
      });
      this.searchData.splice(i, 0, { 'isSearchable': true });
      this.searchItem = '';
      this.tableData = this.originalTableData;
      // this.updateData(this.tableData);
      this.dataSource.data = this.tableData;
      this.autoFocus();
    }
  }

  // private updateData(tableData:any){
  //   this.dataSource.data = tableData;    
  // }

  private autoFocus() {
    let inputFocus;
    setTimeout(() => {
      inputFocus = document.querySelectorAll("input#column-search");
      if (inputFocus.length) {
        inputFocus[0].style.display = 'block';
        inputFocus[0].focus();
      }
    });
  }
}
