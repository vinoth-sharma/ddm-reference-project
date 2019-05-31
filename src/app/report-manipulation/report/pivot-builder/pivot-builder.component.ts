import { Component, OnInit, Inject, Input, Optional, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ReportsService } from '../reports.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pivot-builder',
  templateUrl: './pivot-builder.component.html',
  styleUrls: ['./pivot-builder.component.scss']
})

export class PivotBuilderComponent implements OnInit {
  @Input() view;
  public columns = [];
  public tableData = [];
  public selectedFilters = [];
  public selectedRows = [];
  public selectedColumns = [];
  public selectedValues = [];

  public aggregations = ['Sum', 'Average', 'Max', 'Min'];
  public selectedAggregations = [];

  // public edit: boolean;
  public edit = {};

  @Input() public pivotData = {
    data: this.tableData,
    rows: this.selectedRows,
    columns: this.selectedColumns,
    values: this.selectedValues,
    filters: this.selectedFilters,

    aggregations: this.selectedAggregations,

    _data: []
  };
  @Output() update = new EventEmitter();
  private data;
  constructor(private reportsService: ReportsService,
    @Optional() @Inject(MAT_DIALOG_DATA) data) {
    if (this.view !== 'sidenav') {
      this.view = 'dialog';
      this.data = data;
      if (this.data) {
        this.columns = Object.keys(this.data[0]);
      }
    } else {
      this.data = this.pivotData._data;
      this.selectedFilters = this.pivotData.filters;
      this.selectedColumns = this.pivotData.columns;
      this.selectedRows = this.pivotData.rows;
      this.selectedValues = this.pivotData.values;

      this.selectedAggregations = this.pivotData.aggregations;

      this.tableData = this.pivotData.data;
    }

    console.log('pivotData', this.pivotData);
    
  }

  ngOnInit() {
    if (this.view === 'sidenav') {
      this.data = this.pivotData._data;
      this.selectedFilters = this.pivotData.filters;
      this.selectedColumns = this.pivotData.columns;
      this.selectedRows = this.pivotData.rows;
      this.selectedValues = this.pivotData.values;

      this.selectedAggregations = this.pivotData.aggregations;

      this.tableData = this.pivotData.data;
      this.columns = Object.keys(this.data[0]);

      console.log('ngoninit', this.pivotData, this.selectedValues);
      
    }
  }

  updateTableData() {
    // this.reportsService.getAggregatedTable(this.data, this.selectedRows, this.selectedValues)
    this.reportsService.getAggregatedTable(this.data, this.selectedRows, this.selectedAggregations)

      .then((res: any[]) => {
        this.tableData = res;
        this.pivotData = {
          data: this.tableData,
          rows: this.selectedRows,
          columns: this.selectedColumns,
          
          // values: this.selectedAggregations,

          values: this.selectedValues,
          filters: this.selectedFilters,

          aggregations: this.selectedAggregations,

          _data: this.data
        };
        this.update.emit(this.pivotData);
      })
      .catch(error => {
        console.log(`Error: ${error}`);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedRows, event.previousIndex, event.currentIndex);
    this.updateTableData();
  }

  removeRow(row: string) {
    // this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
    this.selectedRows = this.selectedRows.filter(item => item !== row);
    this.updateTableData();
  }

  removeValue(value: string) {
    this.selectedValues = this.selectedValues.filter(item => item !== value);
    
    this.selectedAggregations.splice(this.selectedValues.indexOf(value), 1);

    // this.aggregation[value] = '';

    console.log('removeValue', value, this.selectedValues.indexOf(value), this.selectedValues, this.selectedAggregations);   

    this.updateTableData();
  }

  public aggregation = {};

  setAggregation() {

    // this.edit[index] = false;

    for (let i = 0; i < this.selectedValues.length; i++) {
      
      let item = {
        field: this.selectedValues[i],
        aggregation: this.aggregation[this.selectedValues[i]]
      }
      
      // this.selectedAggregations[i] = item;

      this.selectedAggregations[this.selectedValues[i]] = item;

    }

    console.log('setAggregation', this.selectedValues, this.selectedAggregations, this.aggregation);

    this.updateTableData();
  }

  // toggleEdit(index: number) {
  //   this.edit[index] = !this.edit[index];
  // }

}
