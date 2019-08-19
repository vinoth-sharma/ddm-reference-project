import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-configure-pivot',
  templateUrl: './configure-pivot.component.html',
  styleUrls: ['./configure-pivot.component.css']
})
export class ConfigurePivotComponent implements OnInit {
  @Input() sheetData: any;
  @Input() tabData: any;
  @Output() closeSideBar = new EventEmitter();

  function = ['sum', 'avg', 'min', 'max', 'count']

  injectedData: any = {
    tableData: '',
    sheetData: ''
  }

  columnDetails = [];
  selected = {
    tab_name: '',
    tab_type: 'pivot',
    tab_sub_type: 'pivot',
    uniqueId: null,
    tab_title: '',
    data: {
      rowField: [],
      dataField: [],
      column: []
    },
    isSelected: false,
  }

  rowField_temp = [];
  enableSaveConfig: boolean = false;

  constructor(public reportViewService: ReportViewService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.tabData);

    this.injectedData.sheetData = this.sheetData;

    this.selected.tab_title = this.tabData.tab_title ? this.tabData.tab_title : this.tabData.tab_name;
    this.selected.uniqueId = this.tabData.uniqueId;
    this.selected.data.column = this.tabData.data.column;
    this.selected.data.rowField = this.tabData.data.rowField;
    this.selected.data.dataField = this.tabData.data.dataField;
    this.rowField_temp = this.selected.data.dataField.map(ele => ele.value);

    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      // console.log(res);
      this.injectedData.tableData = res;
      // console.log(this.injectedData);
      if (this.injectedData.tableData.column_properties) {
        this.columnDetails = this.injectedData.tableData.column_properties.map(col => {
          return { columnName: col.mapped_column, dataType: col.column_data_type }
        })
      }
      else {
        this.columnDetails = this.injectedData.tableData.data.sql_columns.map(col => {
          return { columnName: col, dataType: '' }
        })
      }
      this.enableSaveConfig = true;
    })

  }

  // rowFieldSelected(event) {
  //   this.selected.data.rowField = event.value;
  // }

  dataFieldSelected(event) {

    let checkedDataField = event.value;

    checkedDataField.forEach(element => {
      if (this.selected.data.dataField.some(ele => ele.value === element)) {
        return 0
      }
      else {
        this.selected.data.dataField.push({
          function: '',
          value: element
        })
      }
    });

    this.selected.data.dataField = this.selected.data.dataField.filter(ele => {
      if (checkedDataField.some(obj => obj === ele.value))
        return true
      else
        return false
    })

    this.enableSaveConfig = this.formValid();
  }


  formValid() {
    if (this.selected.data.rowField.length > 0 && this.selected.data.dataField.length > 0) {
      return this.selected.data.dataField.every(datafield => {
        return datafield.function && datafield.value
      })
    }
    else
      return false
  }

  saveConfig() {
    if (this.formValid) {
      this.reportViewService.updatePivotPageJson(this.selected, this.sheetData);
      this.closeSideBar.emit('close')
    }
  }

  cancelConfig() {
    this.closeSideBar.emit('close')
  }
}
