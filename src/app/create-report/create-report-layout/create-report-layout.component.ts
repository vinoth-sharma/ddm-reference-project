import { Component, OnInit, ViewChild} from '@angular/core';
import * as $ from "jquery";
import {HttpClient} from '@angular/common/http';
import { SharedDataService } from "../shared-data.service";
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { Router, ActivatedRoute } from '@angular/router';
import Utils from '../../../utils';
import { QueryBuilderService } from '../../query-builder/query-builder.service';
import { CreateReportLayoutService } from './create-report-layout.service'
import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service';
import { MatSort } from '@angular/material';
import { ConstantService } from '../../constant.service';

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent : PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  enableButtons: boolean = false;
  query: string;
  pageSize : number;
  public semanticId;
  PageSizeOptions : number[];
  // public columnsKeys:any = [];
  public  fullData :any = [];
  public tableData:any = [];
  public showAll:boolean = false;
  public isLoading:boolean = false;
  dataSource;
  public rowCount: number;
  displayedColumn= [];
  public errorMessage:string = "";
  public isPreview:boolean = false;
  isCallable:boolean = false;
  public formulaObj = {};
  public requestDetails:any;
  isDqm = false;
  isExistingReport:boolean = false;
  isCopyPaste:boolean = false;
  formulaTextarea = '';
  isNewSheetFrExistingRepo:boolean = false;
  functions = []
  seggregationDataFilter: any[];

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private queryBuilderService:QueryBuilderService,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private createReportLayoutService: CreateReportLayoutService,
    private semanticReportsService:SemanticReportsService,
    private constantService:ConstantService) {
      this.functions = this.constantService.getSqlFunctions('aggregations');
      console.log("ALL FUNCTIONS : ",this.functions);
      
  }

  ngOnInit() {

    this.isDqm = this.semanticReportsService.isDqm
    //this is for edit report

    this.activatedRoute.queryParams.subscribe(params =>{

  
      if(params.report && params.sheet){
        
        Utils.showSpinner();
        this.createReportLayoutService.getAllForEdit(params).subscribe(data => {

          this.isCopyPaste = data['data']['is_copy_paste'];

          if(this.isCopyPaste) {
            // query update
            this.formulaTextarea = data['data']['query_used'];

            this.sharedDataService.setEditRequestId(data['data']['sheet_json']['request_id']);
         
            this.sharedDataService.setSaveAsDetails({'name':data['data']['report_name'],'desc':data['data']['description'],'isDqm':data['data']['is_dqm']});

            Utils.hideSpinner();
          } else {
              //  Calculated column data
            this.sharedDataService.setFormulaCalculatedData(data['data']['sheet_json']['calculated_fields']);
            this.sharedDataService.setCalculatedData(data['data']['calculated_column_data']);

            //Add aggregations
            this.sharedDataService.setAggregationData(data['data']['sheet_json']['aggregations']['data'],data['data']['sheet_json']['aggregations']['aggregation']);

            //Order by
            this.sharedDataService.setOrderbyData(data['data']['sheet_json']['orderBy']);

            //having
            this.sharedDataService.setHavingData(data['data']['sheet_json']['having']);
                      
            //Condition
            this.sharedDataService.setNewConditionData(data['data']['sheet_json']['condition']['data']);
            this.sharedDataService.setConditionData(data['data']['condition_data']);
            this.sharedDataService.setExistingCondition(data['data']['condition_data']);
            
            //select tables
            this.sharedDataService.setSelectedTables(data['data']['sheet_json']['selected_tables']);
          
            for(let key in data['data']['sheet_json']['formula_fields']){
              if(key === 'select'){
                for(let innerKey in data['data']['sheet_json']['formula_fields'][key]){
                  this.sharedDataService.setFormula([key, innerKey],data['data']['sheet_json']['formula_fields'][key][innerKey]);
                }
              }
              this.sharedDataService.setFormula([key],data['data']['sheet_json']['formula_fields'][key]);
            }

            this.enablePreview(true);
            this.sharedDataService.setNextClicked(true);
            this.sharedDataService.setExistingColumns(data['data']['calculated_column_data']);
            this.sharedDataService.setEditRequestId(data['data']['sheet_json']['request_id']);
         
            this.sharedDataService.setSaveAsDetails({'name':data['data']['report_name'],'desc':data['data']['description'],'isDqm':data['data']['is_dqm']});

            Utils.hideSpinner();
          }
      
        })

       
      }
      else if(params.report){
        this.isDqm = true;
        this.isExistingReport = true;
        this.sharedDataService.setReportConditionFlag(true);
        this.isNewSheetFrExistingRepo = true;
      }
      else{
        
        this.sharedDataService.setSelectedTables([]);
        this.sharedDataService.resetFormula();
        this.sharedDataService.setExistingColumns([]);
        this.sharedDataService.setFormulaCalculatedData([]);
        this.sharedDataService.setAggregationData([],'');
        this.sharedDataService.setOrderbyData([]);
        this.sharedDataService.setNewConditionData([]);
        this.sharedDataService.setExistingCondition({});

      }
        this.sharedDataService.formula.subscribe(formula => {
        this.formulaObj = formula;
        })

    })

    // TODO: jquery 
    if (!$("#sidebar").hasClass("active")) {
      $("#sidebar").toggleClass("active"); 
    }

  }

  public reset(){
    this.semanticId;
    // this.columnsKeys = [];
    this.tableData = [];
  }


    /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  } 

  // public executeSql(event){
  //   // let query = this.isCopyPaste ? event.formula : 'SELECT * FROM ('+this.sharedDataService.generateFormula(this.formulaObj)+ ') WHERE ROWNUM <= 250'
  //   let query = this.isCopyPaste ? event.formula : this.sharedDataService.generateFormula(this.formulaObj)   
  //   this.query = query;  
  //   let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:250};

  //   Utils.showSpinner();
  //   // this.columnsKeys = [];
  //   this.tableData = [];
  //   this.queryBuilderService.executeSqlStatement(data).subscribe(
  //     res => {
  //       this.errorMessage = "";
  //       Utils.hideSpinner();

  //       if (res['data']["list"].length) {
  //         // this.columnsKeys = this.getColumnsKeys(res['data']["list"][0]);
  //         this.displayedColumn = res['data']['sql_columns'];
  //         this.tableData = res['data']["list"];
  //         this.rowCount = res['data']['total_row_count'];
  //         this.dataSource = this.tableData;
  //         this.dataSource = new MatTableDataSource(this.dataSource);
  //         this.dataSource.paginator = this.paginator;
  //         // this.displayedColumn = this.columnsKeys;
  //       }
  //     },
  //     err => {
  //       Utils.hideSpinner();
  //       this.tableData = [];
  //       this.errorMessage = err['message']['error'];
  //     }
  //   );
  // }

  setPageSizeOptions (setPageSizeOptionsInput : string) {
    this.PageSizeOptions = setPageSizeOptionsInput.split('.').map(str => +str);
  }

    /**
   * getColumnsKeys
   */
  public getColumnsKeys(column) {
    return Object.keys(column);
  }

  public goBack(){
    this.isPreview = false;
    this.sharedDataService.setFormula(['groupBy'],"");
    console.log("ALL FUNCTIONS : ",this.functions);
    
  }

  public goToView(event){
    this.isPreview = false;
    this.getSemanticId();
    // this.executeSql(event);
    this.getPreviewData(event);
    this.isPreview = true;
    this.errorMessage = '';
  }

  previewData;

  getPreviewData(event){
    this.generateGroupBy();
    let l_query = this.isCopyPaste ? event.formula : this.sharedDataService.generateFormula(this.sharedDataService.getFormulaObject())   
    // this.query = query;  
    // let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:250};
    this.previewData = {
      sl_id : this.semanticId,
      query : l_query
    }
  }
  
  public generateGroupBy(){
    // formulaObject['select']['calculated']
    let formulaObject = this.sharedDataService.getFormulaObject();
    let arr = [];
    if(formulaObject['select']['calculated'].length > 0){
      arr.push(...formulaObject.select.tables)

    formulaObject['select']['calculated'].forEach(cal=>{
      let flag = false;
      for(let i=0;i<this.functions.length;i++){
        if(cal.includes(this.functions[i].name))
          flag = true;
      }
      // flag?'':arr.push(cal);
      flag?'':arr.push(cal.slice(0,cal.lastIndexOf(' ')));  // removing the calc-name
    })
    formulaObject.groupBy = arr.toString()
    console.log(formulaObject);
    
    }
    else{
      console.log("No calcs added!");
    }

    // arr.push(...formulaObject.select.tables)

    // formulaObject['select']['calculated'].forEach(cal=>{
    //   let flag = false;
    //   for(let i=0;i<this.functions.length;i++){
    //     if(cal.includes(this.functions[i].name))
    //       flag = true;
    //   }
    //   flag?'':arr.push(cal);
    // })
    // formulaObject.groupBy = arr.toString()
    // console.log(formulaObject);
    
  }

  // DONT DELETE THIS FUNCTION
  public updateGroupByQueryDetails(originalQuery: string){
    let originalQueryObtained = originalQuery;
    console.log("Latest ORIGINAL-QUERY : ",originalQueryObtained);
    let formulaObject = this.sharedDataService.getFormulaObject();
    console.log("Latest FORMULA OBJECT : ",formulaObject);
    console.log("FUNCTIONS AVAILABLE : ",this.functions);
    

    let currentFormulaObject = {
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
    
    currentFormulaObject = formulaObject;
    console.log("Cloned FORMULA OBJECT : ",formulaObject);
    this.seggregationDataFilter = []

  //   this.functions.map(i=>{if(this.deletingNonAggregationFn.includes(i.name)){
  //     this.aggregationType = true;}
  //  })

    // this.functions.forEach((element,index) => { 
    //   if(currentFormulaObject['select']['calculated'][index] && currentFormulaObject['select']['calculated'][index].includes(element.name)){
    //     seggregationDataFilter[index] = true;
    //   }
    //   else{
    //     seggregationDataFilter[index] = false;
    //   }
    // });

    // let temp = currentFormulaObject['select']['calculated'].map(i=>i.updateAggregationsPresence(i))
    // console.log("temp values : ", temp);
    
    // console.log("seggregationDataFilter VALUES : ",this.seggregationDataFilter);

    // computing the groupBy
    let groupByFormulaPart = []
    groupByFormulaPart = [...['select']['tables']];

    let counter = 0;
    for(let i=0 ;i<formulaObject['select']['calculated'].length;i++){
      console.log("CALCULATED FIELD : ",formulaObject['select']['calculated'][i]);
      for(let j=0 ;j<this.functions.length;j++){
        if(formulaObject['select']['calculated'][i].includes(this.functions[j]['name'])){
          counter = 0;
          console.log("Breaking  now!!");
          break;
        }
        else{
          // groupByFormulaPart.push(formulaObject['select']['calculated'][i])
          counter++;
        }
      }
      if(counter > 0){
        groupByFormulaPart.push(formulaObject['select']['calculated'][i])
      }

    }

    console.log("FINAL GROUPBY part : ",groupByFormulaPart );
    currentFormulaObject['groupBy'] = groupByFormulaPart.toString();

    console.log("FINAL currentFormulaObject part : ",currentFormulaObject );
    return this.sharedDataService.generateFormula(this.formulaObj)   
    // return groupByFormulaPart.toString();
    // group
    
  }

  // public updateAggregationsPresence(calculatedFieldValue){
  //   this.functions.map((i,t)=>{if(calculatedFieldValue.includes(i.name)){
  //     this.seggregationDataFilter[t] = true;
  //     return;
  //   }
  //   else{
  //     this.seggregationDataFilter[t] = false;
  //     return;
  //   }
  //  })
  // }

  enablePreview(event){
    this.enableButtons = event;
  }

  getRequestDetails(){
    let id;
    this.activatedRoute.queryParams.subscribe(params =>{
      if(params.report){
        id = this.sharedDataService.getEditRequestId();
      }else{
        id = this.sharedDataService.getRequestId();
      }
    });
    
    this.createReportLayoutService.getRequestDetails(id).subscribe( res =>{
      this.requestDetails = res;
    },error =>{
      this.requestDetails = [];
    });
  }

  resetQuery(){
    this.sharedDataService.resetQuery();
  }

}