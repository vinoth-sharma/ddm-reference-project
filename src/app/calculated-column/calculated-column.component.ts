import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ConstantService } from '../constant.service';
import { Router } from '@angular/router';
import Utils from '../../utils';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../create-report/shared-data.service';
import { SemdetailsService } from '../semdetails.service';

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
      // this.relationTables['tables'] = Array.isArray(tables) ? tables : [];
      if(tables.length){
        this.tables = this.getTables(tables,'mapped_table_name');
        this.columns = this.getColumns(tables);
      // this.resetState();
      }
    });

    this.objectExplorerSidebarService.getCCC.subscribe(data => {
      this.isMultipleData();
      if(data && data.table_attrs && data.table_attrs.length) {
        this.reset(data);
      }
      
    })

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
    this.groupByControl.setValue(data['group_by']);
    let chips = [];
    let mapped_column_name = data['mapped_column_name'];
    data['formula'].forEach((data,index) => {
      chips.push({'columnName':mapped_column_name[index+1],'formula':data})
    })
    this.groupByControl.setValue(data['group_by']);
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
        if(!this.allowMultiColumn) {
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
        // if(!this.allowMultiColumn)
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
 
    // currentList.length > 0 || add after chip implementation
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
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;

    if(this.isColumn(event.option.value.split('.')[1])){
      this.getDetails(event.option.value,'groupBy');
    }
    this.oldValue[index] = event.option.value + '  ';
    
    this.groupByControl.setValue(this.oldValue.join(' '));
  }

  public inputValue(value){
    if((value || '').trim()) {
      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {  element + ' '; });
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    } else{
      this.suggestionList = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
    }
  }

  public getDetails(event, type){
    this.columnUsed = [];
    let ids = [];
    ids = this.tables.map(table => {
      if(event.split('.')[0] === table.alias)
        return table.id;
    });
    this.columnUsed.push(event);
    // this.columnUsed.push(event);
    this.tableUsed.push(...ids);
    let unique = [...new Set(this.tableUsed)];
    this.columnUsed = [...new Set(this.columnUsed)]
    this.tableUsed = unique.filter(element => { return element !== undefined });
    if(type === 'groupBy') {
      if(this.groupByControl.value === ''){
        this.groupByColumns = [];
      }
      this.groupByColumns = [...this.groupByColumns,...this.columnUsed];
    }
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim()).includes(item.toUpperCase().trim());
  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        ));
    }
    let columns = [];
     columns = this.selectedTable.map(ele => {
                   return ele['table'] && ele['table']['mapped_column_name'].map(data => {
                      if(data.toLowerCase().includes(value.toLowerCase())) {
                        return `${ele.select_table_alias}.${data}`
                      }
                    })
                  });
                  columns = columns.filter(column => column);
        columns.forEach(data => {
          columnList.push(...data.filter(data => data));
        })
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList}];
  }

  public onSelectionChanged(event) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;

    if(this.isColumn(event.option.value.split('.')[1])){
      this.getDetails(event.option.value, '');
    }
    this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(this.oldValue.join(' '));
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

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

      //joinse
      // obj.joins = [];
      // let join_type = element.join;
      let relations = [];
      element.keys.forEach(key => {
        let keyObj = { 
          'primary_key': key.primaryKeyName,
          'operator': key.operation,
          'foreign_key': key.foreignKeyName,
          'primary_alias': this.getAlias(element.columnAlias, key.primaryKeyName),
          'foreign_key_alias': this.getAlias(element.columnAlias ,key.foreignKeyName)
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

  getAlias(alias, columnName) {
    let aliasName = '';
    for(let key in alias) {
      if(key === columnName) {
        aliasName = alias[columnName];
      }
    }
    return aliasName;
  }

  create() {
    let options = { 
      'sl_id': this.sl_id,
      'custom_table_name': this.tableName.value,
      'custom_table_id': this.allowMultiColumn ? this.customTableId : '',
      'calculated_column_name': this.allowMultiColumn ? this.chips.map(value => value.columnName) :[this.columnName.value],
      'formula': this.allowMultiColumn ? this.chips.map(value => value.formula) : [this.queryTextarea.value],
      'group_by': this.groupByColumns.map(value => {
        return {'table_alias': value.split('.')[0],'column_name': value.split('.')[1]}
      }),
      'table_attrs': this.getTableData(this.selectedTable)
    }

    Utils.showSpinner();
    this.objectExplorerSidebarService.addColumn(options).subscribe(response => {
      this.toasterService.success('Added calculated column successfully');
      Utils.hideSpinner();
      Utils.closeModals();
      this.sharedDataService.resetQuery();
      this.resetObj();
      this.getCustomTables();
    }, error => {
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
    if (this.columnName.value) {
      this.columnName.setValue(null);
      this.queryTextarea.setValue(null);
      this.tableUsed = [];
      this.columnUsed = [];
      this.columnName.setErrors(null);
      this.queryTextarea.setErrors(null);
    }
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

  isValidSelectTable(event) {
    this.invalidTables = event.isValid;
  }
}
