import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ReportsService } from '../reports.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-pivot',
  templateUrl: './pivot.component.html',
  styleUrls: ['./pivot.component.scss']
})

export class PivotComponent implements OnInit {
  @Input() public pivotData: any;
  @Output() update = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public columns = [];
  public filters = [];
  public selectedFilters = [];
  private filteredKeys = ['__isHidden__', '__expanded__', '__endIndex__', '__level__'];
  public expandableSymbol = '__level__';
  public expansionMapping = [];
  public maxLevel = 0;
  public dataSource;

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {    
    this.dataSource =  new MatTableDataSource(this.pivotData.data);
    
    this.columns = Object.keys(this.pivotData.data[0]).filter(key => !this.filteredKeys.includes(key));
    this.filters = [...new Set(this.pivotData._data.map(item => item[this.pivotData.filters]))];
    this.maxLevel = this.pivotData.data.map(item => item[this.expandableSymbol]).sort((a, b) => b - a)[0];

    console.log('ngoinint in pivot', this.pivotData, this.dataSource);    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;    
    this.dataSource.paginator = this.paginator;   
  }

  updateTableData() {
    const filteredTable = this.pivotData._data.filter(item => this.selectedFilters.includes(item[this.pivotData.filters]));
    
    // this.reportsService.getAggregatedTable(filteredTable, this.pivotData.rows, this.pivotData.values)
    this.reportsService.getAggregatedTable(filteredTable, this.pivotData.rows, this.pivotData.aggregations)

      .then(res => {
        this.pivotData.data = res;
        this.dataSource.data =  this.pivotData.data;

        this.columns = Object.keys(this.pivotData.data[0]).filter(key => !this.filteredKeys.includes(key));
        this.filters = [...new Set(this.pivotData._data.map(item => item[this.pivotData.filters]))];
        this.maxLevel = this.pivotData.data.map(item => item[this.expandableSymbol]).sort((a, b) => b - a)[0];
               
        console.log('updateTableData in pivot', this.pivotData, this.dataSource);    

      })
      .catch(error => {
        console.log(`Error: ${error}`);
      });
  }

  updatePivotData(event) {
    this.pivotData = event;
    this.dataSource.data =  this.pivotData.data;

    this.columns = Object.keys(this.pivotData.data[0]).filter(key => !this.filteredKeys.includes(key));
    this.filters = [...new Set(this.pivotData._data.map(item => item[this.pivotData.filters]))];
    this.maxLevel = this.pivotData.data.map(item => item[this.expandableSymbol]).sort((a, b) => b - a)[0];

    this.update.emit(this.pivotData);

    console.log('updatePivotData in pivot', this.pivotData, this.dataSource);    

  }

  toggleRows(rowNumber: number) {
    const targetRow = this.pivotData.data[rowNumber];
    targetRow['__expanded__'] = !targetRow['__expanded__'];
    for (let i = rowNumber + 1; i <= targetRow['__endIndex__']; i++) {
      this.pivotData.data[i]['__isHidden__'] = !targetRow['__expanded__'];
    }
  }

  // getAggregatedValues(aggregation: string, values: number[]) {
  //   switch (aggregation) {
  //     case 'Sum':
  //       return values.reduce((a, b) => a + b, 0);

  //     case 'Max':
  //       return Math.max(...values);

  //     case 'Min':
  //       return Math.min(...values);

  //     case 'Average':
  //       return values.reduce((a, b) => a + b, 0) / values.length;

  //   }
  // }

  // getValues(column: string){
  //   // let values = 
    
  //   return this.dataSource.data.map(v => v[column]).filter(f => !isNaN(f));

  //    // temp1.map(v => v['SELLG_SCE_NO']).filter(f => !isNaN(f));
  // }

}
