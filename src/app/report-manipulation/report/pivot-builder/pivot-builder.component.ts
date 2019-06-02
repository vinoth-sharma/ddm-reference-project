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
  public selectedAggregations = [];
  public aggregations = ['Sum', 'Average', 'Max', 'Min'];
  public aggregation = {};
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

      for (const key in this.selectedAggregations) {
        this.aggregation[key] = this.selectedAggregations[key]['aggregation'];
      }

      console.log('pivotData', this.pivotData, this.selectedValues, this.selectedAggregations, this.aggregation);

    }
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

      for (const key in this.selectedAggregations) {
        this.aggregation[key] = this.selectedAggregations[key]['aggregation'];
      }

      console.log('ngoninit', this.pivotData, this.selectedValues, this.selectedAggregations, this.aggregation);

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
          values: this.selectedValues,
          filters: this.selectedFilters,
          aggregations: this.selectedAggregations,
          _data: this.data
        };
        this.update.emit(this.pivotData);

        console.log('updateTableData', this.pivotData, this.selectedValues, this.selectedAggregations, this.aggregation);
        
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
    delete this.aggregation[value];
    delete this.selectedAggregations[value];

    this.updateTableData();
  }

  setAggregation() {    
    for (let i = 0; i < this.selectedValues.length; i++) {     
      let item = {
        field: this.selectedValues[i],
        aggregation: this.aggregation[this.selectedValues[i]] || this.aggregations[0]
      }
      this.selectedAggregations[this.selectedValues[i]] = item;
    }
    
    this.disableEdit();
    this.updateTableData();
  }

  toggleEdit(value: string) {
    this.edit[value] = !this.edit[value];
  }

  disableEdit() {
    for (const key in this.edit) {
      this.edit[key] = false;
    }
  }

}
