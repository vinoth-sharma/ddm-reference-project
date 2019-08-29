import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { ConstantService } from '../constant.service';

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css'],
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};
  @Input() allowMultiColumn:boolean;
  @Output() save = new EventEmitter();

  private functions;
  public tables = [];
  public columns = [];
  public chips = [];
  public suggestionList: any[] = [];
  tableUsed = [];
  curentName:string = '';
  customTable:any = [];
  selectable = true;
  removable = true;
  columnUsed =[];
  oldValue:any;
  customColumn:any = [];

  tableName: FormControl = new FormControl('',[Validators.required,this.validateTable.bind(this), this.duplicateTable.bind(this)]);
  originalTable: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl('',[Validators.required]);
  columnName:  FormControl = new FormControl('',[Validators.required,this.validateColumn.bind(this), this.duplicateColumn.bind(this)]);
  columnControl: FormControl = new FormControl();
  groupByControl: FormControl = new FormControl();

  constructor(
    private objectExplorerSidebarService:ObjectExplorerSidebarService,
    private constantService: ConstantService
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
  }

  ngOnChanges() {
    this.reset();
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

  validateTable(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim()){
      if( this.checkValidate(value) ){
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

    if (currentList.length > 0 || existingTableList.length > 0 || existingColumnList.length > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  duplicateTable(control: AbstractControl): {[key: string]: boolean} | null {
    let value = control.value;
    if((value || '').trim() && this.curentName !== value){
      if ( this.checkDuplicate(value) ) {
        if(!this.allowMultiColumn)
        this.tableName.setErrors({'incorrect': false})
          return {'dupName': true};
      } else {
        this.tableName.setErrors(null);
        return null;
      }
    }
    return {'dupName': null};
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
   
  }

  public reset() {
    // this.tableName.setValue((this.allowMultiColumn ) ? this.table['custom_table_name'] :  '');
    this.originalTable.setValue(this.table ? this.table['mapped_table_name'] : '')
    // this.columnName.setValue('');
    this.queryTextarea.setValue('');
    this.chips = [];
    this.columnName.reset();
    this.columnControl.setValue([]);
    this.queryTextarea.reset();
    // this.groupByControl.reset();
    if(this.allowMultiColumn){
      this.groupByControl.setValue(this.table['group_by']);
    }else {
      this.groupByControl.setValue('');
    }



    if(!this.allowMultiColumn)
      this.tableName.reset();



  if(this.allowMultiColumn) {
    this.tableName.setValue(this.table['custom_table_name']);
    this.columnName.setValue('');
    this.groupByControl.setValue(this.table['group_by']);
    let chips = [];
    let mapped_column_name = this.table['mapped_column_name'];
    this.table['formula'].forEach((data,index) => {
      chips.push({'columnName':mapped_column_name[index+1],'formula':data})
    })
    this.chips = chips;
    this.columnControl.setValue(this.table['mapped_column_name']);
    this.table['mapped_column_name'] = this.table['columns'][0];
  } else {
    this.tableName.setValue('');
    this.columnName.setValue('');
    this.chips = [];
    this.groupByControl.setValue('');
  }
  }

  public addCalculatedColumn() {
    if(this.allowMultiColumn){
      this.add();
    }

    let data = {
      parent_table :  Array.isArray(this.table['mapped_table_name']) ? this.table['mapped_table_name'][0] : this.table['mapped_table_name'],
      custom_table_name: this.tableName.value,
      calculated_column_name:  this.allowMultiColumn ? this.chips.map(value => value.columnName) : [this.columnName.value],
      formula: this.allowMultiColumn ?  this.chips.map(value => value.formula) :  [this.queryTextarea.value],
      custom_table_id: this.table['custom_table_id'] || '',
      mapped_columns: this.columnControl.value,
      group_by: this.columnUsed
    }
    console.log(data,'data');
    this.save.emit(data);
  }

  public getSelected(chip){
    this.curentName = chip.columnName;
    this.columnName.setValue(chip.columnName);
    this.queryTextarea.setValue(chip.formula);
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

  public inputValue(value){
    if((value || '').trim()) {
      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {  element + ' '; });
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    } else{
      this.suggestionList = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
    }
  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        ));
    }
    columnList = this.table['mapped_column_name'].filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    });
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList}];
  }

  public onSelectionChanged(event) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;

    if(this.isColumn(event.option.value)){
      this.getDetails(event.option.value);
    }
    this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(this.oldValue.join(' '));
  }

  public onGroupbySelection(event) {
    if (this.groupByControl["value"] === null) {
      this.groupByControl.setValue("");
    }
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;

    if(this.isColumn(event.option.value)){
      this.getDetails(event.option.value);
    }
    this.oldValue[index] = event.option.value + '  ';
    
    this.groupByControl.setValue(this.oldValue.join(' '));
  }

  public getDetails(event){
    let ids = [];
    ids = this.tables.map(table => {
      if(event.split('.')[0] === table.alias)
        return table.id;
    });
    // this.columnUsed.push(event.split('.')[1]);
    this.columnUsed.push(event);
    this.tableUsed.push(...ids);
    let unique = [...new Set(this.tableUsed)];
    this.columnUsed = [...new Set(this.columnUsed)]
    this.tableUsed = unique.filter(element => { return element !== undefined });
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim()).includes(item.toUpperCase().trim());
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
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

}