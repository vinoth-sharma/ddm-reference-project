import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private selectedTables = [];
  private formula = {
    'tables': '',
    'conditions': '',
    'aggregations': '',
    'calculated-fields': '',
    'existing-calculated' : ''
  }
  private updatedFormula: string = '';
  private calculatedData:any = [];
  private reportList:any = [];

  private formulaString = new BehaviorSubject('');
  currentFormula = this.formulaString.asObservable();


  // private isPriview = new BehaviorSubject('');
  // preview = this.isPriview.asObservable();

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

  /**
   * getSelectedTables
   */
  public getSelectedTables() {
    return this.selectedTables;
  }

  /**
   * setSelectedTables
   */
  public setSelectedTables(data: any) {
    this.selectedTables = data;
  }

  /**
   * setFormula
   */
  // public setFormula(tab: string, formula: string) {
  //   this.formula[tab] = formula;

  //   this.updateFormula(this.getFormula());
  // };
  
  public setFormula(tab: string, formula: string){
    this.formula[tab] = formula;

    this.updatedFormula = formula;

    this.updateFormula(formula);
  }

  public getFormula(){
    return this.updatedFormula;
  }
  /**
   * getFormula
   */
  // public getFormula(tab?: string) {
  //   let formula: string = '';
  //   if(tab == 'calculated-fields'){
  //     let fromPos = this.formulaString.search('from');
  //   }
  //   if (tab && this.formula[tab]) {
  //     formula = this.formula[tab];
  //   }
  //   else {
  //     for (const key in this.formula) {
  //       if (this.formula.hasOwnProperty(key)) {
  //         formula = `${formula} ${this.formula[key]}`;
  //       }
  //     }
  //   }
    
  //   return formula;
  // };

  public updateFormula(formula: string) {
    this.formulaString.next(formula);
  }

  public isAppliedCaluclated(){
    return (this.calculatedData.length > 0 );
  }

  public setCalculatedData(data:any){
    this.calculatedData = data;
  }

  public getCalculateData(){
    return this.calculatedData;
  }

  // public setPreview(show: boolean){
  //   this.isPriview.next(show);
  // }

  // public getPreview(){
  //   preview
  //   this.formulaString.next(formula);
  // }


  public preview = new Subject<boolean>();

  public $toggle = this.preview.asObservable();

  setToggle(val:boolean){
    this.preview.next(val);
  }

  public setReportList(data:any){
    this.reportList = data;
  }

  public getReportList(){
    return this.reportList;
  }
}