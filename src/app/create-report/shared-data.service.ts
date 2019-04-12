import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private calculatedData: any = [];
  private conditionData: any = [];
  private formulaCalculatedData: any = [];
  private reportList: any = [];
  private keyChips: any = [];

  public selectedTables = new Subject<any[]>();
  public $selectedTables = this.selectedTables.asObservable();

  public preview = new Subject<boolean>();
  public $toggle = this.preview.asObservable();

  public formula = new Subject<any>();
  public $formula = this.formula.asObservable();

  private isNextClicked = new Subject<boolean>();

  private formulaObj = {
    select: {
      tables: [],
      calculated: [],
      aggregations: []
    },
    from: '',
    joins: [],
    groupBy: '',
    where: ''
  };

  // mock data for selectedTables 
  // private selectedTables = [
  //   {
  //     "table": {
  //       "mapped_table_name": "CDC_VEH_ORDER_CHG_DTL",
  //       "view_to_admins": true,
  //       "sl_tables_id": 2283,
  //       "mapped_column_name": [
  //         "AFTER_VALUE",
  //         "%76",
  //         "DATA_ELMT_NAME",
  //         "DATA_SEQ_NUM",
  //         "EXTRACTION_TIMESTAMP",
  //         "EXT_TIME_EXTENSION",
  //         "IMAGE_TYPE",
  //         "OPERATION",
  //         "ORDER_NUM",
  //         "VEH_EVNT_CD",
  //         "VEH_EVNT_SEQ_NUM"
  //       ]
  //     },
  //     "columns": [
  //       "AFTER_VALUE"
  //     ]
  //   }
  // ]

  constructor(private http: HttpClient) { }

  public setSelectedTables(tables: any) {
    this.selectedTables.next(tables);
  }


  public setFormula(tabs: string[], formula: any) {
    if (this.formulaObj[tabs[0]].hasOwnProperty(tabs[1])) {
      this.formulaObj[tabs[0]][tabs[1]] = formula;
    }
    else {
      this.formulaObj[tabs[0]] = formula;
    }

    this.formula.next(this.formulaObj);
  }

  public resetFormula() {
    this.formulaObj = {
      select: {
        tables: [],
        calculated: [],
        aggregations: []
      },
      from: '',
      joins: [],
      groupBy: '',
      where: ''
    };

    this.formula.next(this.formulaObj);
  }

  public generateFormula(formulaObject, rowLimit = 10) {
    let selectedColumns = [];
    Object.keys(formulaObject.select).forEach(item => {
      selectedColumns = selectedColumns.concat(formulaObject.select[item]);
    });

    const selectedColumnsToken = selectedColumns.join(", ");
    const joinToken = formulaObject.joins.length ? formulaObject.joins.join(" ") : '';
    const whereToken = formulaObject.where.length ? `${formulaObject.where} AND ROWNUM <= ${rowLimit}` : `ROWNUM <= ${rowLimit}`;
    const groupByToken = formulaObject.groupBy.length ? `GROUP BY ${formulaObject.groupBy}` : '';

    const formula = `SELECT ${selectedColumnsToken}
    FROM ${formulaObject.from}
    ${joinToken}
    WHERE ${whereToken}
    ${groupByToken}`;

    return formula;
  }

  public isAppliedCaluclated() {
    return (this.calculatedData.length > 0);
  }

  public setCalculatedData(data: any) {
    this.calculatedData = data;
  }

  public getCalculateData() {
    return this.calculatedData;
  }

  public isAppliedCondition() {
    return (this.conditionData.length > 0);
  }

  public setConditionData(data: any) {
    this.conditionData = data;
  }

  public getConditionData() {
    return this.conditionData;
  }

  public setFormulaCalculatedData(data: any) {
    this.formulaCalculatedData = data;
  }

  public getFormulaCalculatedData() {
    return this.formulaCalculatedData;
  }

  setToggle(val: boolean) {
    this.preview.next(val);
  }

  public setReportList(data: any) {
    this.reportList = data;
  }

  public getReportList() {
    return this.reportList;
  }

  public getCalculatedKeyData(){
    return this.keyChips;
  }

  public setCalculatedKeyData(data){
    this.keyChips = data;
  }

  public setNextClicked(isClicked: boolean){
    this.isNextClicked.next(isClicked);
  }

  public getNextClicked(){
    return this.isNextClicked.asObservable();
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public getAllForEdit(id) {
    let url = `${environment.baseUrl}reports/get_report_edit_data?report_list_id=${id}`;

    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }
}