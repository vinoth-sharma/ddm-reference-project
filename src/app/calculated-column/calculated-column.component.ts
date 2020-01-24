import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ConstantService } from '../constant.service';
import { Router } from '@angular/router';
import Utils from '../../utils';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../create-report/shared-data.service';
import { SemdetailsService } from '../semdetails.service';
import { constants_value } from "../constants";

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css']
})
export class CalculatedColumnComponent implements OnInit {

  tableUsed = [];
  columnUsed =[];
  oldValue:any;
  private functions;
  public suggestionList: any[] = [];
  selectedTable:any[] = [];
  sl_id;
  chips=[];
  customTableId = '';
  allowMultiColumn;
  customColumn:any[] = [];
  customTable:any[] = [];
  tables:any[] = [];
  groupByColumns = [];
  columns:any[] = [];
  selectable = true;
  selectDataList = [];
  removable = true;
  invalidTables;
  curentName:string = '';
  lastWord = '';

  tableName: FormControl = new FormControl('',[Validators.required,this.validateTable.bind(this), this.duplicateTable.bind(this)]);
  groupByControl: FormControl = new FormControl();
  columnName:  FormControl = new FormControl('',[Validators.required,this.validateColumn.bind(this), this.duplicateColumn.bind(this)]);
  queryTextarea: FormControl = new FormControl('',[Validators.required]);
  
  constructor(
    private objectExplorerSidebarService:ObjectExplorerSidebarService,
    private constantService: ConstantService,
    private semanticService: SemdetailsService,
    private route: Router,
    private toasterService: ToastrService,
    private sharedDataService:SharedDataService
  ) {
    this.functions = this.constantService.getSqlFunctions('aggregations');
   }

  ngOnInit() {

    this.objectExplorerSidebarService.getCustomTables.subscribe((views) => {
      if(views.length){
        this.customTable = this.getTables(views,'custom_table_name');
        this.customColumn = this.getColumns(views);
      }
    });

    this.objectExplorerSidebarService.getTables.subscribe((tables) => {
      if(tables.length){
        this.tables = this.getTables(tables,'mapped_table_name');
        this.columns = this.getColumns(tables);
      }
    });

    this.objectExplorerSidebarService.getCCC.subscribe(data => {
      this.isMultipleData();
      if(data && data.table_attrs && data.table_attrs.length) {
        this.reset(data);
      }  
    });

    this.groupByControl.valueChanges
    .debounceTime(200)
    .distinctUntilChanged()
    .subscribe(value => {
      if(!(value || '').trim()) {
        this.groupByColumns = [];
      }
    });
  }

  public reset(data) {
    let selectedTable = [];
    data.table_attrs.forEach(element => {
      selectedTable.push(element.selectTable)
    });
    this.sharedDataService.setSelectedTables(selectedTable);
    this.selectedTable = selectedTable;
    this.queryTextarea.setValue('');
    this.chips = [];
    this.columnName.reset();
    this.queryTextarea.reset();

  if(this.allowMultiColumn) {
    this.tableName.setValue(data['custom_table_name']);
    this.columnName.setValue('');
    this.groupByControl.setValue(data['group_by'].join(''));
    let chips = [];
    let mapped_column_name = data['mapped_column_name'];
    data['formula'].forEach((data,index) => {
      chips.push({'columnName':mapped_column_name[index],'formula':data})
    })
    this.groupByControl.setValue(data['group_by'].join(''));
    this.chips = chips;
    this.customTableId = data['custom_table_id'];
  } else {
    this.groupByControl.setValue('');
    this.tableName.setValue('');
    this.columnName.setValue('');
    this.chips = [];
    this.groupByControl.setValue('');
  }
  }

  public getTables(tables,type) {  
    return tables.map(element => {
      return element[type];
    });
  }

  public getColumns(tables) {
    let columnData = [];

    let columnWithTable = tables.map(element => {
        return [...element['mapped_column_name']];
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    
    return columnData;
  }

  isMultipleData() {
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        this.sl_id = element.data["semantic_id"];
      }
      if(element.path == "semantic" && element.children[2].children[4].path == 'calculated-column'){
        
        this.allowMultiColumn = element.children[2].children[4].data.allowMultiColumn;
        if(!this.allowMultiColumn){
          this.resetObj();
        }
      }
    });
  }

  validateTable(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim()){
      if( !this.allowMultiColumn &&  this.checkValidate(value) ){
        this.tableName.setErrors({'incorrect': false})
        return {'tabName': true};
      } else {
        this.tableName.setErrors(null);
        return null;
      }
    }else {
      return {'tabName': null};
    }
  }

  duplicateTable(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim()){  // && this.curentName !== value
      if ( !this.allowMultiColumn && this.checkDuplicate(value) ) {
        this.tableName.setErrors({'incorrect': false})
          return {'dupName': true};
      } else {
        this.tableName.setErrors(null);
        return null;
      }
    }
    return {'dupName': null};
  }

  checkValidate(value) {
    let tableList = this.tables.filter(element => {
      return value.toLowerCase() === element.toLowerCase();
    });

    let columnList = this.columns.filter(element => {
        return value.toLowerCase() === element.toLowerCase();
    });

    if(tableList.length > 0 || columnList.length > 0){
      return true;
    } else {
      return false;
    }
  }

  checkDuplicate (value) {
    let currentList = this.chips.filter((element, key) => {
      return value.trim().toLowerCase() === element['formula'].trim().toLowerCase();
    });
    let existingTableList = this.customTable.filter(element => {
        return value.toLowerCase() === element.toLowerCase();
    });

    let existingColumnList = this.customColumn.filter(element => {
        return value.toLowerCase() === element.toLowerCase();
    });
 
    if ( existingTableList.length > 0 || existingColumnList.length > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  public onGroupbySelection(event) {
    if (this.groupByControl["value"] === null) {
      this.groupByControl.setValue("");
    }
    let i;
    let value = this.lastWord.split(" ");
    for ( i = 0;i < value.length;i++) {
      if(value[i] == this.oldValue) {
        value[i] = event.option.value + ' ';
        break;
      }
    }
    this.groupByControl.setValue(value.join(' '));
  }

  public inputValue(value, id){
    if(id === "customCccId")
      this.queryTextarea.setValue(value)
    else
      this.groupByControl.setValue(value)

    let query = <HTMLInputElement>document.getElementById(id);
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
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      // this.suggestionList = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
      this.suggestionList = this.getSearchedInput('');
    }
  }

  public getDetails(event){
    let tId, cId;
   
    tId = event.split('.')[0]
    cId = event.split('.')[1];
     return {'table_alias': tId, 'column_name': cId}
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim()).includes(item.toUpperCase().trim());
  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
    this.functions.forEach(element => {
      if(!value || element.name.toLowerCase().includes(value.toLowerCase())) {
                functionArr.push(element);
              } 
    });
    
    let columns = [];
     columns = this.selectedTable.map(ele => {
                   return ele['table'] && ele['table']['mapped_column_name'].map(data => {
                      if(!value || data.toLowerCase().includes(value.toLowerCase())) {
                        return `${ele.select_table_alias}.${data}`
                      }
                    })
                });
                if(columns[0]){
                  columns = columns.map(data => { 
                            let colData =  data.filter(ele => {
                              return ele !== undefined
                            });
                          return colData;
                  });
                  columns.forEach(data => {
                    columnList.push(...data.map(data => { return {'name':data,'formula':data }}));
                  });
                }
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList}];
  }

  public onSelectionChanged(event) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }

    let i;
    let value = this.lastWord.split(" ");
    for ( i = 0;i < value.length;i++) {
      if(value[i] == this.oldValue) {
        value[i] = event.option.value + ' ';
        break;
      }
    }
    this.setTextareaValue(value.join(' '));
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  getData(event) {
    this.selectedTable = event;
  }

  getTableData(arg) {
    let options = [];
    arg.forEach(element => {
      let obj;
        obj = { 
          'table_name' : element['table'].select_table_name,
          'alias_name': element.select_table_alias,
          'columns' : []
        }
      element.columns.forEach(name => {
        let column = {};
        if(name !== 'all') {
          column['column_name'] = name;
          column['alias_name'] = '';
        for(let alias in element['columnAlias']) {
          if(alias === name) {
            column['alias_name'] = element.columnAlias[name];
          }
        }
        obj.columns.push(column);
        }
      
      });

      let relations = [];
      element.keys.forEach(key => {
        let keyObj = { 
          'primary_key': key.primaryKeyName,
          'operator': key.operation,
          'foreign_key': key.foreignKeyName,
          'primary_alias': key.primaryKey.table_name,
          'foreign_key_alias': key.foreignKey.table_name
        }
       relations.push(keyObj);
        obj.selectTable = element;
        obj.joins = {
          'join_type' : element.join,
          'relations' : relations
        };
      });

      options.push(obj);
    });

  return options;
  }

  create() {
    this.add();
    let ids,groupByUsed = []
    let values = this.groupByControl.value ? this.groupByControl.value.split(',') : '';
    for (let i = 0;i < values.length;i++) {
        ids = this.getDetails(values[i]);
        groupByUsed.push(ids);
    }
    this.doColumnAliasSpaceValidation();
    let options = { 
      'sl_id': this.sl_id,
      'custom_table_name': this.tableName.value,
      'custom_table_id': this.allowMultiColumn ? this.customTableId : '',
      // 'calculated_column_name': this.allowMultiColumn ? this.chips.map(value => value.columnName) :[this.columnName.value],
      // 'formula': this.allowMultiColumn ? this.chips.map(value => value.formula) : [this.queryTextarea.value],
      'calculated_column_name': this.allowMultiColumn ? this.chips.map(value => value.columnName) :[this.chips[0].columnName],
      'formula': this.allowMultiColumn ? this.chips.map(value => value.formula) : [this.chips[0].formula],
      'group_by': groupByUsed,
      'table_attrs': this.getTableData(this.selectedTable)
    }
    //column name with space - add key while creating calc
    options.formula = [ this.columnNameWithSpaceHandler(options.formula[0]) ];
    options.group_by.forEach(groupBy=>{
      groupBy.column_name = this.columnNameWithSpaceHandler(groupBy.column_name)
    })
    // console.log(options);
    Utils.showSpinner();
    this.objectExplorerSidebarService.addColumn(options).subscribe(response => {
      this.toasterService.success('Added calculated column successfully');
      Utils.hideSpinner();
      Utils.closeModals();
      this.sharedDataService.resetQuery();
      this.resetObj();
      this.getCustomTables();
    }, error => {
      // this.resetObj();
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
    });
  }

  resetObj() {
    this.sharedDataService.setSelectedTables( 
     [ {'tables': {
      'related tables': [],
      'tables': this.tables,
      'custom tables': this.customTable
    }}]);
    this.tableName.setValue('');
    this.queryTextarea.setValue('');
    this.chips = [];
    this.columnName.reset();
    this.queryTextarea.reset();
    this.groupByControl.reset();
  }

  getCustomTables() {
    this.semanticService.getviews(this.sl_id).subscribe(response => {
      let views = response['data']['sl_view'];
      this.objectExplorerSidebarService.setCustomTables(views);
    }, error => {
      this.toasterService.error(error.message);
    })
  }

  remove(tag) {
    const index = this.chips.findIndex(x => x.columnName === tag.columnName);
    if(tag.columnName === this.columnName.value){
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  public add(){
    const input = this.columnName.value;
    const value = this.queryTextarea.value;
    this.chips = [];
    if ((value || '').trim() && (input || '').trim()) {
      if(this.checkDuplicateChip(input)){
        this.chips.forEach(chip => {
          if(chip['columnName'].toLowerCase() === input.toLowerCase()){
            {
              chip['columnName'] = input.trim(),
              chip['formula']  = value.trim()
            }
          }
        });
      }else{
        this.chips.push( {formula: value.trim(),columnName: input.trim()} );
      }
    }
    // if(this.columnName.value) {
    //   this.columnName.setValue(null);
    //   this.queryTextarea.setValue(null);
    //   this.tableUsed = [];
    //   this.columnUsed = [];
    //   this.columnName.setErrors(null);
    //   this.queryTextarea.setErrors(null);
    // }
  }

  checkDuplicateChip(input) {
    let isChipDuplicate = false;
    this.chips.forEach(data => {
      if(data['columnName'].toLowerCase() === input.toLowerCase()) {
        isChipDuplicate = true;
      }
    })
    return isChipDuplicate;
  }

  public getSelected(chip){
    this.curentName = chip.columnName;
    this.columnName.setValue(chip.columnName);
    this.queryTextarea.setValue(chip.formula);
  }

  //validation

  duplicateColumn(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if(!(value || '').trim()){
      return {'dupColName': null};
    }
    if(this.curentName !== value){
      if ( this.checkDuplicate(value) ) {
        if(!this.allowMultiColumn)
        this.columnName.setErrors({'incorrect': false})
          return {'dupColName': true};
      } else {
        this.columnName.setErrors(null);
        return null;
      }
    } else {
      this.columnName.setErrors(null);
    }
    // return {'dupColName': true};   //remove it
  }

  validateColumn(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim()){
      if( this.checkValidate(value) ){
        this.columnName.setErrors({'incorrect': false})
        return {'colName': true};
      }else {
        this.columnName.setErrors(null);
        return null;
      }
    }else {
      return {'colName': null};
    }
  }

  isValidSelectTable(event) {
    this.invalidTables = event.isValid;
  }

  getSelectedColumns(selectedTables){
    let l_columns = [];
    selectedTables.forEach(element => {
      l_columns.push(...element.table.mapped_column_name)
    });
    return l_columns
  }

  doColumnAliasSpaceValidation(){
    this.selectedTable.forEach(row=>{
      let obj = row.columnAlias;
      let keys = Object.keys(obj);
      for(let i=0;i<keys.length;i++){
        obj[keys[i]] = this.spaceHandler(obj[keys[i]])
      }
      row.columnAlias = obj;
    })
    // console.log(this.selectedTable);
  }

  spaceHandler(str){
    return str?str.trim().replace(/\s+/g," ").replace(/\s/g,constants_value.column_space_replace_value):"";
  }

  columnNameWithSpaceHandler(val){
    let columns = this.getSelectedColumns(this.selectedTable)
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
}

