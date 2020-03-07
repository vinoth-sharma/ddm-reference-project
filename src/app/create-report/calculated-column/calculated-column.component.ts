import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
// import "rxjs/add/operator/debounceTime";
// import "rxjs/add/operator/distinctUntilChanged";
import { SharedDataService } from "../shared-data.service";
import { CalculatedColumnService } from "./calculated-column.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";
import { ConstantService } from '../../constant.service';
import { SemdetailsService } from '../../semdetails.service'
import { constants_value } from '../../constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css']
})
export class CalculatedColumnComponent implements OnInit {

  selectedTables = [];
  
  isExistingLoading:boolean = false;
  existingCalcList = [];
  searchedExistingCalc = [];

  //searched functions,calc,columns in formula filed
  sqlFunctions:any = [];
  searchedColumnFuncList = [];
  selectedColumnWithTableId = [];
  tablesListSelected = [];


  formObj = {
    columnName : '',
    formula : '',
    column_used : [],
    table_list : [],
    calculated_field_id : 0,
    table_aliases_used : [] ,
    isExistingCalc : false
  }

  isColumnNameExists:boolean = false;
  chipsList = [];
  selectable = true;
  removable = true;

  //variables for complex queries func
  oldValue:any ;
  lastWord = '' ;

  //variable for expansion panel
  step = null;
  tables = [];
  columns = [];

  constructor( 
    private sharedDataService:SharedDataService,
    private calculatedColumnReportService:CalculatedColumnService,
    private toasterService: ToastrService,
    private constantService: ConstantService,
    private semDetailsService: SemdetailsService, 
    public dialog: MatDialog
  ) {
      this.sqlFunctions = this.constantService.getSqlFunctions('aggregations');
      // Array.prototype.removeDuplicates = function(){
      //   return Array.from(new Set(this))
      // }
    
    }

    //removes duplicate from array
   public removeDuplicates = function(a){
      return Array.from(new Set(a))
    }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tableList => {
      console.log(tableList);
      this.chipsList = [];
      this.resetFormObj();
      this.selectedTables = tableList;
      this.selectedColumnWithTableId = this.getColumns();
      this.getExistingCalcList(false);
      // this.tables = this.getTables();
      // this.columns = this.getColumns();
      
      this.removeDeletedTableDataFromChips(this.sharedDataService.getFormulaCalculatedData());
    });
  }

  removeDeletedTableDataFromChips(data){
    let ids = this.getTableIds();
    this.chipsList = data.filter(calc=>{
      return calc.table_list.every(id=>ids.includes(id))
    })
  }

  createCalcColumn(type){
    this.getColumnTableData();

    if(type === "add"){
      // this.chipsList.push(this.formObj);
      this.updateOrAdd2Chips();
      this.resetFormObj();
    }
    else{
      if(this.formObj.isExistingCalc)
        this.createUpdateCalc2ExistingList("update")
      else
        this.createUpdateCalc2ExistingList("create")
    }
  }

  createUpdateCalc2ExistingList(type){
    if(type === "create"){
      //while create , create to existing and adding to chips
      // this.chipsList.push(this.formObj);
      // this.updateOrAdd2Chips();
      this.chipsList = this.chipsList.filter(chip=>{
        return chip.calculated_field_id !== this.formObj.calculated_field_id
      })
      // if(this.chipsList.some() this.formObj.calculated_field_id)
      this.calculatedColumnReportService.createCalculatedField(this.formObj).subscribe(res=>{
        this.formObj.isExistingCalc = true;
        this.formObj.calculated_field_id = res.data.calculated_field_id;
        this.updateOrAdd2Chips();
        this.getExistingCalcList(false)
        this.resetFormObj();
      })
    }
    else if(type === "update"){
      this.calculatedColumnReportService.updateCalculatedField(this.formObj).subscribe(res=>{
        // this.formObj.isExistingCalc = true;
        this.updateOrAdd2Chips();
        this.getExistingCalcList(false)
        this.resetFormObj();
      })
    }

  }

  updateOrAdd2Chips(){
    if(this.chipsList.some(chip=>chip.calculated_field_id === this.formObj.calculated_field_id)){
      this.chipsList.forEach(chip=>{
        if(chip.calculated_field_id === this.formObj.calculated_field_id){
          chip.formula = this.formObj.formula;
          chip.columnName = this.formObj.columnName;
          chip.column_used = this.formObj.column_used;
          chip.table_list = this.formObj.table_list;
          chip.isExistingCalc = this.formObj.isExistingCalc;
        }
      })
    }
    else
    {
      this.chipsList.push(this.formObj);
    }
  }

  //chips functionality
  removeCalcColumn(chip,i){
    this.step = 0;
    this.chipsList.splice(i,1);
    this.updateCheckedInExisting();
    this.updateAppearanceSelectall()
  }

  updateCheckedInExisting(){
    this.existingCalcList.forEach(element => {
      if(this.chipsList.some(chip=>chip.calculated_field_id === element.calculated_field_id))
        element['isChecked'] = true;
      else
        element['isChecked'] = false;
    });
    this.searchedExistingCalc = JSON.parse(JSON.stringify(this.existingCalcList));
  }

  isSelectedAll :boolean = false;
  checkSelectAll(event){
    if(this.isSelectedAll){
      this.searchedExistingCalc.forEach(calc=>{
         calc.isChecked = true;
         this.checkedExistingCalc(calc)
      })
    }
    else{
      this.searchedExistingCalc.forEach(calc=>{
        calc.isChecked = false;
        this.checkedExistingCalc(calc)
     })
    }

  }

  //update select all button whnever checked/unchecked
  updateAppearanceSelectall(){
    if(this.searchedExistingCalc.every(ele=>ele.isChecked))
      this.isSelectedAll = true;
    else
      this.isSelectedAll = false;
  }

  selectClacColumn(chip,i){
    this.formObj = JSON.parse(JSON.stringify(chip));
  }

  //check column name exists
  checkDuplicateName(){
    this.isColumnNameExists = false; //initiatizing the flag
    this.chipsList.forEach(ele=>{
      if(ele.columnName.trim().toLowerCase() === this.formObj.columnName.trim().toLowerCase() &&
          !(ele.calculated_field_id === this.formObj.calculated_field_id))
        this.isColumnNameExists = true;
    })
    this.existingCalcList.forEach(ele=>{
      if(ele.calculated_field_name.trim().toLowerCase() === this.formObj.columnName.trim().toLowerCase() &&
        !(ele.calculated_field_id === this.formObj.calculated_field_id))
        this.isColumnNameExists = true;
    })
  }

  checkDuplicate(){
    let flag = false; //initiatizing the flag
    this.chipsList.forEach(ele=>{
      if(ele.columnName.trim().toLowerCase() === this.formObj.columnName.trim().toLowerCase() &&
          !(ele.calculated_field_id === this.formObj.calculated_field_id))
        flag = true;
    })
    this.existingCalcList.forEach(ele=>{
      if(ele.calculated_field_name.trim().toLowerCase() === this.formObj.columnName.trim().toLowerCase() &&
        !(ele.calculated_field_id === this.formObj.calculated_field_id))
        flag = true;
    })
    return true
  }

  //when checking existing calc
  checkedExistingCalc(calc){
    if(calc.isChecked){
      let obj = {
        columnName : calc.calculated_field_name ,
        formula : calc.calculated_field_formula ,
        column_used : calc.column_used ,
        table_list : calc.table_list,
        calculated_field_id : calc.calculated_field_id ,
        table_aliases_used : calc.cal_field_json,
        isExistingCalc : calc.isExistingCalc
      }
      if(!this.chipsList.some(ele=>ele.calculated_field_id === calc.calculated_field_id))
        this.chipsList.push(obj)
    }
    else
      this.chipsList = this.chipsList.filter(chip=>chip.calculated_field_id !== calc.calculated_field_id)

      this.updateAppearanceSelectall()
  }



  getColumnTableData(){
    let l_columnUsed = [] ,l_tableUsed = [] ,l_tableAliasUsed = [];
    this.selectedColumnWithTableId.forEach(obj=>{
      if(this.formObj.formula.toLowerCase().includes(obj.column_name.toLowerCase())){
        l_columnUsed.push(obj.column_name);
        l_tableUsed.push(obj.table_id);
        l_tableAliasUsed.push({ alias_name : obj.select_table_alias, table_id : obj.table_id});
      }
    })
    //if no columns selected
    l_tableUsed = l_tableUsed.length?l_tableUsed:this.selectedColumnWithTableId.map(obj=>obj.table_id)
    this.formObj.column_used = this.removeDuplicates(l_columnUsed);
    this.formObj.table_list = this.removeDuplicates(l_tableUsed);
    // this.formObj.table_aliases_used = Object.values(l_tableAliasUsed.reduce((acc,cur)=>Object.assign(acc,{[cur.table_id]:cur}),{}))
    this.formObj.calculated_field_id = this.formObj.calculated_field_id === 0?+new Date():this.formObj.calculated_field_id;
    this.formObj.columnName = this.columnAliasSpaceHandler(this.formObj.columnName.trim());
    this.formObj.formula = this.columnNameWithSpaceHandler(this.formObj.formula.trim());
  }

  getTableIds() {
    let tableIds = this.selectedTables.map(obj=>obj.tableId)
    return tableIds;
  }

  inputColumnName(value){
    this.formObj.columnName = value;
    this.checkDuplicateName();
  }

  public inputValue(event, value){
    this.formObj.formula = value;
    let query = <HTMLInputElement>document.getElementById('cccId');
    let i;
    for(i = query.selectionStart-1; i>=0;i--) {
      if(value[i] === ' ') {
        break;
      }
    }
    i++;
    const word = value.slice(i).split(" ")[0];

    if((word || '').trim()){
      this.lastWord = value;
      this.oldValue = word.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.searchedColumnFuncList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      this.lastWord = value;
      this.searchedColumnFuncList = this.getSearchedInput('');
    }

  }

  private getSearchedInput(value: any) {
    let functionArr = this.sqlFunctions.filter(func=>{
      return func.name.toLowerCase().includes(value.toLowerCase())
    })
    let columnList = this.selectedColumnWithTableId.filter(col=>{
      return col.column_name.toLowerCase().includes(value.toLowerCase())
    }).map(ele=>{ return { name : ele.column_name , formula : ele.column_name } })
    let calcList = this.chipsList.filter(calc=>calc.columnName.toLowerCase().includes(value.toLowerCase()) || calc.columnName.length === 0)
                                  .map((obj,i)=>{ return { name : obj.columnName?obj.columnName:`Column_${i}` , formula : obj.formula }})          

    return [{ groupName:'Functions',values: functionArr } ,
            { groupName:'Columns',values: columnList } ,
            { groupName: 'Calculated Columns' , values : calcList }
            ]
  }

  public onSelectionChanged(event) {
    let eventValue = event.option.value;
    let value = this.lastWord.split(" ");
    for (let i = 0;i < value.length;i++) {
      if(value[i] == this.oldValue) {
        value[i] = eventValue + ' ';
        break;
      }
    }
    this.formObj.formula = this.lastWord?value.join(" "):eventValue + " ";
  }

  addToFormulaBar(){
    let formula = [];
    
    this.chipsList.forEach(element=>{
      formula.push(`${ element.formula} ${element.columnName}`);          
    });

    this.sharedDataService.setCalcData(this.chipsList);
    this.sharedDataService.setFormula(['select','calculated'],formula);
    this.sharedDataService.setFormulaCalculatedData(this.chipsList);

    // this.sharedDataService.setCalculatedData(this.getFormatData());
    $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
  
  }

  openDeleteDialog(data){
    let obj = { modalTitle : '' , modalBody : '' , modalBtn : 'Delete' };
    obj.modalTitle = 'Delete Calculated Column';
    obj.modalBody = `This operation delete Calculated column (${data.calculated_field_name}) from existing list permanently. 
                     Do you want to proceed ?`

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: obj
    })
    dialogRef.afterClosed().subscribe(result=>{
      result.confirmation?this.deleteCalcColumn(data):'';
    })
  }

  deleteCalcColumn(data){
    this.calculatedColumnReportService.deleteCalcField(data.calculated_field_id).subscribe(res=>{
      this.chipsList = this.chipsList.filter(chip=>!chip.calculated_field_id === data.calculated_field_id)
      this.getExistingCalcList(true);
    })  
  }

  public getColumns() {
    let columnData = [];
    let columnWithTable = this.selectedTables.map(element => {
        return element['table']['column_properties'].map(col => {
          return { column_name : `${element['select_table_alias']}.${col.column}` ,
                   table_id : element.tableId ,
                    type : element.tableType ,
                    select_table_alias : element.select_table_alias }
        });
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    return columnData;
  }

  private columnAliasSpaceHandler(str){
    return str?str.trim().replace(/\s+/g," ").replace(/\s/g,constants_value.column_space_replace_value):"";
  }
  
  private columnNameWithSpaceHandler(val){
    let columns = this.selectedColumnWithTableId.map(ele=>ele.column_name);
    let l_value = val;
    let key = constants_value.column_space_replace_value;
    let regEx = new RegExp(key,"gi");
    columns = columns.filter(col=>{
      return col.indexOf(key) === -1?false:true;
    })
    
    columns.forEach(column=>{
      let l_col = column.replace(regEx," ");
      let regEx1 = new RegExp(l_col,"gi");
      l_value = l_value.replace(regEx1,column)
    })
      return l_value    
  }

  private getExistingCalcList(flag){
    this.isExistingLoading = true;
    let obj = { 
      table_ids: this.getTableIds() 
    }
    this.calculatedColumnReportService.getCalculatedFields(obj).subscribe(res => {
      this.existingCalcList = [];
      let l_response = res['data'];
      // l_response = this.updateAliasName(l_response);
      l_response.forEach(element => {
        if(this.chipsList.some(chip=>chip.calculated_field_id === element.calculated_field_id))
          element['isChecked'] = true;
        else
          element['isChecked'] = false;
      });

      l_response.forEach(element => {
        element['isExistingCalc'] = true;
      });
      this.existingCalcList = l_response;
      this.searchedExistingCalc = JSON.parse(JSON.stringify(l_response));
      this.step = 0;
      this.isExistingLoading = false;
      this.updateAppearanceSelectall()
      if(flag)
      setTimeout(() => {
        this.step = 1;
      }, 0);
    });
  }

  public resetFormObj(){
    this.step = 0;
    this.isColumnNameExists = false;
    this.formObj = {
      columnName : '',
      formula : '',
      column_used : [],
      table_list : [],
      calculated_field_id : 0,
      table_aliases_used : [] ,
      isExistingCalc : false
    }
  }
}
