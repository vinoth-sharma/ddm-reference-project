import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { MatDialog ,  MatDialogRef , MAT_DIALOG_DATA } from "@angular/material/dialog";

import { SharedDataService } from "../shared-data.service";
import { AuthenticationService } from '../../authentication.service';
import { FormulaService } from './formula.service';
import Utils from '../../../utils';
import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service';
import { SaveSheetDialogComponent } from '../save-sheet-dialog/save-sheet-dialog.component';
import { ConstantService } from '../../constant.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  @Output() onView = new EventEmitter();
  @Input() enablePreview:boolean;
  @Input() reportType:boolean;
  @Input() copyPaste:boolean;
  @Input() formulaText:string;

  public formula: any;
  formulaTextarea:string = this.formulaText;
  public selectColumns: string;
  public semanticId: number;
  public userId: string;
  public selectedTables = [];
  public validSelectQuery: boolean = false;
  public isDqm:boolean = false;
  public isEditView:boolean = false;
  public functions = [];
  functionList = {
    agree : [],
    nonAgree : [],
    all:[]
  }
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private formulaService: FormulaService,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private semanticReportsService:SemanticReportsService,
    public dialog : MatDialog,
    private constantService:ConstantService) {
      this.functions = this.constantService.getSqlFunctions('aggregations');
    }

  ngOnInit() {
    let nonAggregations = ['DECODE','ASCIISTR','CHARTOROWID','COMPOSE','CONVERT','DECOMPOSE','HEXTODRAW','NUMTODSINTERVAL','NUMTOYMININTERVAL','RAWTOHEX','ROWIDTOCHAR','TO_CHAR','TO_DATE','TO_MULTI_BYTE','TO_NUMBER','TO_SINGLE_BYTE','UNISTR','ADD_MONTHS','CURRENT_DATE','DBTTIMEZONE','EUL_DATE_TRUNC','LAST_DAY','MONTHS_BETWEEN','NEW_TIME','NEXT_DAY','ROUND','SESSIONTIMEZONE','SYSDATE','TRUNC','ASCII','CHR','CONCAT','INITCAP','INSTR','INSTRB','LENGTH','LENGTHB','LOWER','LPAD','LTRIM','NLSSORT','NLS_INITCAP','NLS_LOWER','NLS_UPPER','REPLACE','RPAD','RTRIM','SOUNDEX','SUBSTR','SUBSTRB','TRANSLATE','UPPER']
    let allFunctions = [...new Set([...this.functions.map(func=>func.name)])]
    let aggregations = allFunctions.filter(ele=>!nonAggregations.some(na=>na===ele))
    this.functionList.agree = aggregations;
    this.functionList.all = allFunctions;
    this.functionList.nonAgree = nonAggregations;
    this.sharedDataService.validQueryFlagEmittor.subscribe(ele=>{
      this.validSelectQuery = ele;
    })

    this.activateRoute.queryParams.subscribe(params =>{
      if(params.report){
        this.isEditView = true;
      }else{
        this.isEditView = false;
      }
    });

    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)
    this.sharedDataService.formula.subscribe(formula => {
      this.formula = formula;
      
      let columns = [];
      for (let key in this.formula['select']) {
        columns.push(...formula['select'][key]);
      }
      this.selectColumns = columns.join(', ');
    })

    this.sharedDataService.saveAsDetails.subscribe(data =>{ 
      this.isDqm = data.isDqm;
    });

    this.isDqm = this.semanticReportsService.isDqm;
    
  }

  ngOnChanges() {
    this.formulaTextarea = this.formulaText;   
  }

  public goToView() {
    this.onView.emit({'formula':this.formulaTextarea});
  }

  public getUserDetails() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });

    this.authenticationService.errorMethod$.subscribe(userId => this.userId = userId);
    return this.semanticId;
  }

  public getColumns() {
    let columnData = [];

    this.selectedTables.forEach(element => {
      columnData.push(...element['columns']);
    });

    return columnData;
  }

  public getTableIds() {
    let tableIds = [];

    this.selectedTables.forEach(element => {
      tableIds.push(element['table']['select_table_id']);
    });

    return tableIds;
  }

  private isNewReport(){
      return this.activateRoute.snapshot.queryParams.report?false:true;
  }

  private getListId(){
    if(this.activateRoute.snapshot.queryParams.report){
      return this.activateRoute.snapshot.queryParams.report
    }else{
      return 0;
    }
  }

  private getSheetId(){
    if(this.activateRoute.snapshot.queryParams.sheet){
      return this.activateRoute.snapshot.queryParams.sheet
    }else{
      return 0;
    }
  }

  saveReport(data){
      this.createEditReport(data);
  }

  openSaveReportDialog(){
    
   let dialogRef = this.dialog.open(SaveSheetDialogComponent,{
      data : {
        sl_id: this.getUserDetails(),
        report_id : +this.getListId(),
        user_id : this.userId
       }
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res.isSave)
         this.createNewSheet(res);
    })
  }

  /**
   * saveReport
   */
  public createNewSheet(data){
    Utils.showSpinner();
    let options = {
      case_id : 3,
      copy_to : +this.getListId(),
      report_list_id : +this.getListId(),
      report_name : data.report_name,
      sl_id : this.getUserDetails(),
      sl_tables_id : this.getTableIds(),
      sheet_name : data.sheet_name,
      query_used : this.sharedDataService.generateFormula(this.formula),
      columns_used : this.getColumns(),
      sheet_json : this.getAllData(),
      condition_flag : this.sharedDataService.isAppliedCondition(),
      conditions_data : this.sharedDataService.getConditionData(),
      calculate_column_flag : this.sharedDataService.isAppliedCaluclated(),
      calculate_column_data : this.sharedDataService.getCalculateData()
    }    

    this.formulaService.createSheetToExistingReport(options).subscribe(
      res => {
        this.sharedDataService.setReportConditionFlag(false);
        this.saveReportExcel({
          report_list_id : res['report_list_id']?res['report_list_id']:options.report_list_id,
          report_name : options.report_name
        },res);
        this.redirectAfterUpload(options,res);
      },
      err => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.error(err['message']['error']);
      }
    )
  }


  public generateGroupBy(){
    // formulaObject['select']['calculated']
    let formulaObject = this.sharedDataService.getFormulaObject();
    // // console.log("LATEST FORMULA-OBJECT :",formulaObject);
    let nonAgreeArr = [];
    let aggreeAvail = false;

    formulaObject['select']['calculated'].forEach(cal=>{
      let ind_agree = -1;
      let ind_nonagree = -1;
      for(let i=0;i<this.functionList.agree.length;i++){
        if(cal.includes(this.functionList.agree[i]))
         { ind_agree = cal.indexOf(this.functionList.agree[i]) 
         } 
      }

      for(let i=0;i<this.functionList.nonAgree.length;i++){
        if(cal.includes(this.functionList.nonAgree[i]))
         {  ind_nonagree = cal.indexOf(this.functionList.nonAgree[i])
         } 
      }
      // // console.log(ind_agree,ind_nonagree);
      if(ind_agree != -1 && ind_nonagree != -1){
        if(ind_agree < ind_nonagree)
          aggreeAvail = true;
        else{
          aggreeAvail = false;
          nonAgreeArr.push(cal)       
        }
      }
      else if(ind_agree != -1 && ind_nonagree === -1)
          aggreeAvail = true;
      else if(ind_nonagree != -1)
      {
        nonAgreeArr.push(cal)
      }
      // flag?'':arr.push(cal.slice(0,cal.lastIndexOf(' ')));  // removing the calc-name
    })
    // nonAgreeArr = nonAgreeArr.map(non=>non.slice(non.lastIndexOf(" ")).trim())
    nonAgreeArr = nonAgreeArr.map(non=>non.slice(0,non.lastIndexOf(" ")))
    let selectedColumns =  formulaObject.select.tables.map(non=>{
      let l_val = non.trim();
      return l_val.lastIndexOf(" ") >= 0? l_val.slice(0,l_val.lastIndexOf(" ")):l_val;
    });
    // console.log("nonAggr",nonAgreeArr);
    let arr = [];
    if(aggreeAvail || nonAgreeArr.length){
      arr.push(...nonAgreeArr,...selectedColumns)
    }
    formulaObject.groupBy = arr.toString()
    // // console.log("FormulaObj in GB:",formulaObject);
  }

  public createEditReport(data: any) {
    Utils.showSpinner();
    this.generateGroupBy();
    let options;
     options = {
        'sl_id': this.getUserDetails(),
        'report_name': data.name,
        "created_by": this.userId,
        'modified_by': this.userId,
        'description': data.desc? data.desc: undefined,
        'is_dqm': this.isDqm,
        'extract_flag': [1, 2],
        'user_id': [this.userId],
        'dl_list': ['dl_list_5'],
        'sl_tables_id': this.copyPaste ? [] :  this.getTableIds(),
        'is_chart': true,
        'query_used': this.copyPaste ? this.formulaTextarea : this.sharedDataService.generateFormula(this.formula),
        'color_hexcode': 'ffffff',
        'columns_used': this.copyPaste ? undefined : this.getColumns(),
        'condition_flag': this.copyPaste ? false : this.sharedDataService.isAppliedCondition(),
        'conditions_data': this.copyPaste ? [] : this.sharedDataService.getConditionData(),
        'calculate_column_flag': this.copyPaste ? false :  this.sharedDataService.isAppliedCaluclated(),
        'calculate_column_data': this.copyPaste ? [] : this.sharedDataService.getCalculateData(),
        'sheet_json': this.copyPaste ? [] : this.getAllData(),
        'is_new_report': this.isNewReport(),
        'report_list_id': +this.getListId(),
        'request_id': this.getRequestId(),
        'sheet_id' : this.getSheetId(),
        'is_copy_paste': this.copyPaste  
    }
    // // console.log("Entering the new formula : ",options.query_used);
    if(this.isNewReport())
      options['sheet_name'] = 'Sheet_1'
    if(options['request_id'] === null || typeof(options['request_id']) === "object" ){
      options['request_id'] = 0;
    }
    else{
      options['request_id'] = this.sharedDataService.getRequestId();
    }

    this.formulaService.generateReport(options).subscribe(
      res => { 

        this.saveReportExcel({
          report_list_id : res['report_list_id']?res['report_list_id']:options.report_list_id,
          report_name : options.report_name
        },res);
        this.redirectAfterUpload(options,res);
        this.sharedDataService.setFormula(['groupBy'],"")
      },
      err => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.error(err['message']['error']);
        this.sharedDataService.setFormula(['groupBy'],"")
      }
    )
  }

  public saveReportExcel(options,res) {
    let optionsBackup = options
    this.formulaService.uploadReport(options).subscribe(
      response => {
        if(response['message'] == 'Failed to upload file. Please try again.'){
          this.sharedDataService.setEcsStatus(false);
          console.log("ECS upload value : ",this.sharedDataService.ecsUpload);
          this.toastrService.error(response['file']['message']);
          this.formulaService.setFailedEcsUploadParameters(optionsBackup);
        }
        else{
          this.sharedDataService.setEcsStatus(true);
          // this.sharedDataService.ecsUpload = true;
          console.log("ECS upload value : ",this.sharedDataService.ecsUpload);
          // this.toastrService.success(response['message']);
          this.toastrService.success("File uploaded succesfully to ECS!!");
          this.formulaService.setFailedEcsUploadParameters({});
        }
        
      },
      err => {
        // this.toastrService.error(err['message']['error']);
        this.sharedDataService.setEcsStatus(false);
        console.log("ECS failure value : ",this.sharedDataService.ecsUpload);
        this.formulaService.setFailedEcsUploadParameters(optionsBackup);
        this.toastrService.error(err['message']['error']);
      }
    )
  }

  redirectAfterUpload(options,res){
    Utils.hideSpinner();
    Utils.closeModals();
    this.sharedDataService.setRequestId(0);
    this.toastrService.success(res['message']);
    if(this.reportType){
      this.router.navigate([`semantic/sem-reports/view/insert/${options.report_list_id}`])  
    }
    else if(this.isDqm){
      this.router.navigate(['semantic/dqm'])  
    }
    else{
    this.router.navigate(['semantic/sem-reports/home']);
    }  
  }

  private getAllData() {
    return {
      'selected_tables': this.getUpdatedTables(),
      'calculated_fields':  this.sharedDataService.getFormulaCalculatedData(),
      'aggregations': this.sharedDataService.getAggregationData(),
      'having': this.sharedDataService.getHavingData(),
      'orderBy': this.sharedDataService.getOrderbyData(),
      'condition': this.sharedDataService.getNewConditionData(),
      'formula_fields': this.formula,
      'request_id' : this.getRequestId()
    };
  }

  private getRequestId() {
    return this.isEditView ? this.sharedDataService.getEditRequestId() : this.sharedDataService.getRequestId();
  }

  private getUpdatedTables() {
    let selectedTables = JSON.parse(JSON.stringify(this.selectedTables));
    selectedTables.forEach(obj => delete obj['tables'])
    // let selectedTables = JSON.parse(JSON.stringify(this.selectedTables));
    return selectedTables;
  }
}
