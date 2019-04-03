import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  // private formula = {
  //   'tables': '',
  //   'conditions': '',
  //   'aggregations': '',
  //   'calculated-fields': '',
  //   'existing-calculated' : ''
  // }

  // private updatedFormula: string = '';
  private calculatedData: any = [];
  private reportList: any = [];

  // private formulaString = new BehaviorSubject('');  
  public selectedTables = new Subject<any[]>();
  public preview = new Subject<boolean>();

  // currentFormula = this.formulaString.asObservable();
  public $selectedTables = this.selectedTables.asObservable();
  public $toggle = this.preview.asObservable();

  public formula = new Subject<any>();
  public $formula = this.formula.asObservable();

  private formulaObj = {
    select: {
      tables: [],
      calculated: [],
      aggregations: []
    },
    from: '',
    joins: [],
    groupBy: [],
    // groupBy: '',
    where: []
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

  constructor() { }

  public setSelectedTables(tables: any) {
    this.selectedTables.next(tables);
  }

  // public setFormula(tab: string, formula: string){
  //   this.formula[tab] = formula;

  //   this.updatedFormula = formula;

  //   this.updateFormula(formula);
  // }

  // public getFormula(tab?: string){
  //   if (tab && this.formula[tab]) {
  //         return this.formula[tab];
  //  }else{
  //   return this.updatedFormula;
  //  }  
  // }

  public setFormula(tabs: string[], formula: any) {
    if (this.formulaObj[tabs[0]].hasOwnProperty(tabs[1])) {
      this.formulaObj[tabs[0]][tabs[1]] = formula;
    }
    else {
      this.formulaObj[tabs[0]] = formula;
    }

    this.formula.next(this.formulaObj);
  }

  // public updateFormula(formula: string) {
  //   this.formulaString.next(formula);
  // }

  public isAppliedCaluclated() {
    return (this.calculatedData.length > 0);
  }

  public setCalculatedData(data: any) {
    this.calculatedData = data;
  }

  public getCalculateData() {
    return this.calculatedData;
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
}