import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private requestId:number;
  private calculatedData: any = [];
  private conditionData: any = [];
  private havingData: string = '';
  private orderbyData: any = {};
  private formulaCalculatedData: any = [];
  private reportList: any = [];
  private newConditionData: any = {};
  private keyChips: any = [];
  private aggregationData: any = [];
  private saveAsData: any = {
    'name' : '',
    'desc' : ''
  }
  private aggregationToken:string = '';
  private existingColumns: any[] = [];
  private conditionName: string = '';
 
  private existingCondition: any = [];
  public selectedTables = new Subject<any[]>();
  public $selectedTables = this.selectedTables.asObservable();

  // public preview = new Subject<boolean>();
  // public $toggle = this.preview.asObservable();

  public formula = new Subject<any>();
  public $formula = this.formula.asObservable();

  private isNextClicked = new Subject<boolean>();
  
  public saveAsDetails = new Subject<any>();
  
  private formulaObj = {
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


  constructor() { }

  public setSelectedTables(tables: any) {
    this.selectedTables.next(tables);
  }
  public validQuery = false;
  public validQueryFlagEmittor = new Subject<any>();

  public checkSelectStatus(){
    
    let objs = Object.keys(this.formulaObj.select)
    this.validQuery = objs.some(ele=>{
      console.log(this.formulaObj.select[ele].length > 0);
      console.log(this.formulaObj.select[ele].length);

      return this.formulaObj.select[ele].length > 0?true:false
    })
    console.log(this.validQuery);
    
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

  public isAppliedCaluclated() {
    return (this.calculatedData.length > 0);
  }

  public setCalculatedData(data: any) {
    this.calculatedData = data;
  }

  public getCalculateData() {
    return this.calculatedData;
  }

  public setNewConditionData(data: any,name:string) {
    this.newConditionData = data;
    this.conditionName = name;
  }

  public getNewConditionData() {
    return ({'data':this.newConditionData,'name':this.conditionName});
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

  // setToggle(val: boolean) {
  //   this.preview.next(val);
  // }

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
  public setExistingCondition(data:any){
    this.existingCondition = data;
  }

  public getExistingCondition(){
    return this.existingCondition;
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

  public getRequestId(){
    return this.requestId;
  }
}
