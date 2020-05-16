import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  public requestId:number;
  public havingData: string = '';
  public orderbyData: any = {};
  public formulaCalculatedData: any = [];
  public reportList: any = [];
  public newConditionData: any = {};
  public keyChips: any = [];
  public aggregationData: any = [];
  public saveAsData: any = {
    'name' : '',
    'desc' : ''
  }
  public aggregationToken:string = '';
  public existingColumns: any[] = [];
  public conditionName: string = '';
  public isReqIdSet:boolean = false;
  public sheetJson:any = [];
  public showSelectReqIdBtn : boolean = false;
   
  public selectedTables = new Subject<any[]>();
  public $selectedTables = this.selectedTables.asObservable();
  public ecsUpload : boolean = true ;

  public formula = new Subject<any>();
  public $formula = this.formula.asObservable();

  public isNextClicked = new Subject<boolean>();
  
  public saveAsDetails = new Subject<any>();
  
  public formulaObj = {
    select: {
      tables: [],
      calculated: [],
      aggregations: []
    },
    from: '',
    joins: [],
    having: '',
    groupBy: '',
    where: '',
    orderBy: ''
  };

  public isNewSheetExistingReport:boolean = false;

  constructor() { }

  public setSelectedTables(tables: any) {
    this.selectedTables.next(tables);
    // console.log("FORMULA OBJECT",this.formulaObj);
    // this.updateAggregations();
  }
  public validQuery = false;
  public validQueryFlagEmittor = new Subject<any>();

  public checkSelectStatus(){
    let objs = Object.keys(this.formulaObj.select)
    this.validQuery = objs.some(ele=>{
      return this.formulaObj.select[ele].length > 0?true:false
    })
    this.validQueryFlagEmittor.next(this.validQuery)
  }

  public setFormula(tabs: string[], formula: any) {
    if (this.formulaObj[tabs[0]].hasOwnProperty(tabs[1])) {
      this.formulaObj[tabs[0]][tabs[1]] = formula;
    }
    else {
      this.formulaObj[tabs[0]] = formula;
    }

    this.formula.next(this.formulaObj);
    this.checkSelectStatus();

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
      having: '',
      groupBy: '',
      where: '',
      orderBy: ''
    };

    this.formula.next(this.formulaObj);
  }
  public resetQuerySeleted = new Subject<any>();

  public resetQuery(){
    this.resetQuerySeleted.next(true);
    this.resetFormula();
    this.checkSelectStatus();
  }

  public generateFormula(formulaObject, rowLimit?) {
    let selectedColumns = [];
    Object.keys(formulaObject.select).forEach(item => {
      selectedColumns = selectedColumns.concat(formulaObject.select[item]);
    });

    const selectedColumnsToken = selectedColumns.join(", ");
    const joinToken = formulaObject.joins.length ? formulaObject.joins.join(" ") : '';
    const whereToken = rowLimit ?
                       formulaObject.where.length ? `WHERE ${formulaObject.where} AND ROWNUM <= ${rowLimit}` : `WHERE ROWNUM <= ${rowLimit}`:
                       formulaObject.where.length ? `WHERE ${formulaObject.where}`: '';
    const havingToken = formulaObject.having.length ? `HAVING ${formulaObject.having}` : '';
    const groupByToken = formulaObject.groupBy.length ? `GROUP BY ${formulaObject.groupBy}` : '';
    const orderByToken = formulaObject.orderBy.length ? `ORDER BY ${formulaObject.orderBy}` : '';

    const formula = `SELECT ${selectedColumnsToken} FROM ${formulaObject.from} ${joinToken} ${whereToken} ${havingToken} ${groupByToken} ${orderByToken}`;
    
    return formula.replace(/[\r\n]+/g, ' ');
  }

  public setNewConditionData(data: any) {
    this.newConditionData = data;
  }

  public getNewConditionData() {
    return ({'data':this.newConditionData});
  }
  
  public calDataForCondition = new Subject();
  public setCalcData(data: any) {
    let l_data = data.map(ele=>{
      return {
        name : ele.columnName,
        formula : ele.formula
      }
    })
    this.calDataForCondition.next(l_data);
  }

  //set sheetjson Calc data
  public setFormulaCalculatedData(data: any) {
    this.formulaCalculatedData = data;
  }
  public getFormulaCalculatedData() {
    return this.formulaCalculatedData;
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

  public setAggregationData(data:any, aggregation:string) {
    this.aggregationData = data;
    this.aggregationToken = aggregation;
  }

  public getAggregationData(){
    return {'data':this.aggregationData,'aggregation':this.aggregationToken};
  }

  public getSaveAsDetails() {
    return this.saveAsDetails.asObservable();
  }

  public setSaveAsDetails(data:any){
    this.saveAsDetails.next(data);
  }

  public getExistingColumns(){
    return this.existingColumns;
  }

  public setExistingColumns(data:any){
    this.existingColumns = data;
  }

  public setOrderbyData(data:any) {
   this.orderbyData = data;
  } 

  public getOrderbyData(){
    return this.orderbyData;
  }

  public getHavingData() {
    return this.havingData;
  }

  public setHavingData(data:any) {
    this.havingData = data;
  }

  public setRequestId(id:number){
    this.requestId = id;
  }

  public setRequestIds(data:any){
    this.requestId = data;
  }

  public getRequestId(){
    return this.requestId;
  }

  public setEditRequestId(value:boolean) {
    this.isReqIdSet = value;
  }

  public getEditRequestId() {
    return this.isReqIdSet;
  }

  public setSheetJSON(sheetJson:any) {
    this.sheetJson = sheetJson;
  }

  public getSheetJSON() {
    return this.sheetJson;
  }

  setReportConditionFlag(value){
    this.isNewSheetExistingReport = value
  }
  getReportConditionFlag(){
    return this.isNewSheetExistingReport
  }
  
  public getFormulaObject(){
    return this.formulaObj;
  }

  public setObjectExplorerPathValue(value:boolean){
    this.showSelectReqIdBtn = value;
  }

  public getObjectExplorerPathValue(){
    return this.showSelectReqIdBtn;
  }

  public setEcsStatus(value : boolean){
    this.ecsUpload = value
  }

  public allTablesData ;
  setTablesDataFromSideBar(data){
    this.allTablesData = data;
  }
  
  getTablesDataFromSideBar(){
    return this.allTablesData;
  }

}
