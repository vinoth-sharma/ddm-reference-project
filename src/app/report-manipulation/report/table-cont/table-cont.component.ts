import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ParametersService } from '../parameters/parameters.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

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

  searchItem: FormControl = new FormControl();
  column: string = '';
  // orderType: string = '';
  // currentColumn: string = '';
  // searchItem: string = '';
  originalTableData = [];
  searchData = [];
  public dataSource;
  searchIndex;

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

    this.searchItem.valueChanges
    .debounceTime(800)
    .distinctUntilChanged()
    .subscribe(value => {
        this.tableData = this.originalTableData;
        
        this.tableData = this.tableData.filter(element => {
          return (element[this.searchIndex] + '').toLowerCase().includes((value + '').toLowerCase())
        });
        this.dataSource.data = this.tableData;
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

  public isSearchable(i,col) {
    this.searchIndex = col;
    if (this.searchData[i]) {
      if (this.searchData[i]['isSearchable']) {
        this.searchData[i]['isSearchable'] = false;
      } else {
        this.searchData.forEach((element, key) => {
          element['isSearchable'] = key === i ? true : false;
        });
        this.searchItem.setValue('');
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
      this.searchItem.setValue('');
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
