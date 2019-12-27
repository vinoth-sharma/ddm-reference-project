import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReportViewService } from '../report-view.service';
import { ToastrService } from "ngx-toastr";
import { switchMap, map, catchError } from 'rxjs/operators';
import { constants_value } from 'src/environments/environment';


@Component({
  selector: 'app-pivot-table-wrapper',
  templateUrl: './pivot-table-wrapper.component.html',
  styleUrls: ['./pivot-table-wrapper.component.css']
})
export class PivotTableWrapperComponent implements OnInit {
  @Input() tabData: any;
  @Input() sheetData: any;
  @Input() type: string;
  @Output() isPivotValidEmittor = new EventEmitter();

  isPivotValid: boolean = false;
  loading: boolean = false;

  constructor(private reportViewService: ReportViewService, private toasterService: ToastrService) { }
  table = {
    rows: [],
    columnNames: []
  }
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.tabData);
    // console.log(this.sheetData);
    this.createPivotTable();
  }

  createPivotTable() {
    if (this.type != 'preview')
      this.reportViewService.loaderSubject.next(true);
    this.loading = true;
    this.reportViewService.getPivotTableData(this.tabData, this.sheetData)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.handleError.bind(this)))
      .subscribe((res: any) => {
        // console.log(res);
        // this.table.rows = res.data.data;
        if (res.data.data.length > 0) {
          let obj = generateTable(res.data, this.tabData);
          this.isPivotValid = true;
          this.isPivotValidEmittor.emit(this.isPivotValid)
          this.table.columnNames = obj.tbale_columns
          this.table.rows = obj.table_rows
        }
        else {
          this.isPivotValid = false;
          this.isPivotValidEmittor.emit(this.isPivotValid)
        }

        // console.log(obj);
        if (this.type != 'preview')
          this.reportViewService.loaderSubject.next(false);
        this.loading = false;
      })
  }

  handleError(error: any): any {

    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };
    this.isPivotValid = false;
    this.isPivotValidEmittor.emit(this.isPivotValid)
    if (this.type != 'preview')
      this.reportViewService.loaderSubject.next(false);
    this.loading = false;
    this.toasterService.error(errObj.message ? this.encryptedWordRemoval(errObj.message.error) : 'error');
    throw errObj;
  }

  encryptedWordRemoval(value){
    let reg = new RegExp(constants_value.encryption_key,"g")
    return value.replace(reg," ")
  }
}

var headers = []
var rows = [];
var t_columns = [];
var request = {
  rows: [],
  values: [],
  columns: [],
  agg_func: []
};

function generateTable(data, req) {
  headers = []
  rows = [];
  t_columns = [];

  request.rows = req.data.rowField;
  request.values = req.data.dataField.map(ele => ele.value)
  request.columns = req.data.column
  request.agg_func = req.data.dataField.map(ele => ele.function)

  rows = data.data;
  let l_rows = request.rows.length;

  for (let i = 0; i < l_rows; i++) {
    let column = data.columns[i];
    column.push("");
    column = column.reverse();
    headers.push(column);
  }

  for (let j = l_rows; j < data.columns.length; j++) {
    let ll = data.columns[j];
    ll.push("")
    headers.push(ll);
  }

  // console.log(headers);
  t_columns = Array.from({ length: headers[0].length }, e => Array(rows[0].length).fill(0));

  request.columns ? request.columns.reverse().forEach((col, i) => {
    let two = headers[0].length - 2 - i
    headers[l_rows - 1][two] = col
  }) : '';
  // console.log(this.t_columns);
  for (let k = 0; k < headers.length; k++) {
    headers[k].forEach((element, index) => {
      t_columns[index][k] = element;
    });
  }

  let temp_ele = undefined;

  t_columns[0] = t_columns[0].map(element => {
    if (temp_ele === element) {
      temp_ele = element;
      return ''
    } else {
      temp_ele = element;
      return element
    }
  });

  // console.log(t_columns);
  return {
    table_rows: rows,
    tbale_columns: t_columns
  }
}