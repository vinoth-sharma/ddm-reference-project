
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {  MatPaginator } from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ParametersService } from '../parameters/parameters.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-cont',
  templateUrl: './table-cont.component.html',
  styleUrls: ['./table-cont.component.scss']
})

export class TableContComponent implements OnInit {

  @Input() tableData;
  @Input() columns: string[];
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;

  searchItem: FormControl = new FormControl();
  column: string = '';
  originalTableData = [];
  searchData = [];
  public dataSource;
  searchIndex;
  colIndex;
  cachedData = [];

  constructor(private parametersService: ParametersService) { }

  ngOnInit() {
    this.column = this.columns[0];
    // this.searchData.length = this.columns.length;
    for(let i=0;i<this.columns.length;i++){
      this.searchData[i] = {};
      this.searchData[i]['isSearchable'] = false;
      this.searchData[i]['filter'] = false;
    }
    this.dataSource = new MatTableDataSource(this.tableData);
    this.originalTableData = this.tableData.slice();
    this.cachedData = this.tableData.slice();
    this.parametersService.paramTables.subscribe(tableList => {
      this.searchData.forEach((element, key) => {
        element['isSearchable'] = false;
        element['filter'] = false;
        element['data'] = '';
      });
      this.tableData = tableList;
      this.cachedData = this.tableData.slice();
      this.dataSource = new MatTableDataSource(tableList);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => 
      {
        if(typeof data[sortHeaderId] === 'string')
          return data[sortHeaderId].toLocaleLowerCase();

          return data[sortHeaderId];
      }
      this.sort.disableClear = true;
      this.dataSource.paginator = this.paginator;
    });

    this.searchItem.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),)
      .subscribe(value => {
        // if((value || '').trim()) {
        //   this.tableData = this.originalTableData;
        if((value || '').trim()){
          this.searchData[this.colIndex]['filter'] = true;
          this.searchData[this.colIndex]['data'] = value;
          this.searchData[this.colIndex]['column'] = this.searchIndex;
          this.searchTableData();
        }else{
          this.searchData[this.colIndex]['filter'] = false;
          this.searchData[this.colIndex]['data'] = value;
          this.searchData[this.colIndex]['column'] = this.searchIndex;
          this.searchTableData();
        }
         
        
        //   this.searchData[this.colIndex]['filter'] = true;
        //   this.tableData = this.tableData.filter(element => {
        //     return (element[this.searchIndex] + '').toLowerCase().includes((value + '').toLowerCase())
        //   });
        //   this.dataSource.data = this.tableData;
        // }else {
        //   // this.searchData[this.colIndex]['filter'] = false;
        // }
        
      });
  }

  searchTableData() {
    let tableData = JSON.parse(JSON.stringify(this.cachedData))
    this.searchData.forEach(ele => {
      if(ele.filter){
        tableData = JSON.parse(JSON.stringify(tableData)).filter(element => {
          return ((element[ele.column] + '').toLowerCase().indexOf((ele.data + '').toLowerCase()) > -1)
        });
      } 
    });
    this.dataSource.data = tableData;
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => 
    {
      if(typeof data[sortHeaderId] === 'string')
        return data[sortHeaderId].toLocaleLowerCase();

        return data[sortHeaderId];
    }
    this.sort.disableClear = true;
    this.dataSource.paginator = this.paginator;
  }

  public isSearchable(i,col) {
    this.colIndex = i;
    this.originalTableData = this.tableData.slice();
    this.searchIndex = col;
    
    if (this.searchData[i]) {
      if (this.searchData[i]['isSearchable']) {
        this.searchData[i]['isSearchable'] = false;
      } else {
        this.searchData.forEach((element, key) => {
          element['isSearchable'] = key === i ? true : false;
          // element['isSearchable'] = element['data'] ? true : false;
        });
        // this.searchItem.setValue('');
        this.searchItem.setValue(this.searchData[i]['data']);
      }
      this.tableData = this.originalTableData;
      // this.dataSource.data = this.tableData;
      this.autoFocus();
    } else {
      this.searchData.forEach((element, key) => {
        element['isSearchable'] = false;
        // element['filter'] = ;
      });
      this.searchData.splice(i, 0, { 'isSearchable': true });
      // this.searchItem.setValue('');
      this.searchItem.setValue(this.searchData[i]['data']);
      this.tableData = this.originalTableData;
      // this.dataSource.data = this.tableData;
      this.autoFocus();
    }
  }

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

  sortData(event) {
    this.paginator.pageIndex = 0;
  }
}
