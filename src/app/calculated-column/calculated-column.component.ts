import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from '@angular/forms';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
// import { ConstantsComponent } from '../constants/constants.component';
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

  current;
  tableId;
  selectedTables = [];
  columnUsed =[];
  confirmFn;
  keyChips = [];
  isError:boolean;
  existingList:any[] = [];
  originalExisting:any[] = [];
  tableName: FormControl = new FormControl('',[Validators.required]);
  originalTable: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl('',[Validators.required]);
  columnName:  FormControl = new FormControl('',[Validators.required]);
  tableControl: FormControl = new FormControl('',[Validators.required]);
  private functions;
  public tables = [];
  public columns = [];
  public chips = [];
  visible = true;
  tableUsed = [];
  curentName:string = '';
  customTable:any = [];
  selectable = true;
  removable = true;
  semanticId;
  public suggestionList: any[] = [];
  oldValue:any;

  constructor(private activatedRoute: ActivatedRoute, 
              private toasterService: ToastrService,
              private objectExplorerSidebarService:ObjectExplorerSidebarService,
              private constantService: ConstantService) {
    this.functions = this.constantService.getSqlFunctions('aggregations');
  }

  ngOnInit() { 
    this.objectExplorerSidebarService.getCustomTables.subscribe((views) => {
      this.customTable = views;

    })
    this.tableName.valueChanges.subscribe(value => {
      if((value || '').trim() )
        this.checkDuplicate(value,'table');
    });
    this.columnName.valueChanges.subscribe(value => {
      if((value || '').trim() )
        this.checkDuplicate(value,'column');
    });
  }

  ngOnChanges() {
    this.reset();
  }

  public reset() {
    this.tableName.setValue((this.allowMultiColumn ) ? this.table['custom_table_name'] :  '');
    this.originalTable.setValue(this.table ? this.table['mapped_table_name'] : '')
    this.columnName.setValue('');
    this.queryTextarea.setValue('');
    this.chips = [];
    if(!this.allowMultiColumn)
      this.tableName.reset();
    this.columnName.reset();
    this.queryTextarea.reset();
  }


  public addCalculatedColumn() {
    if(this.allowMultiColumn){
      this.add();
    }

    let data = {
      sl_id: this.semanticId,
      parent_table :  Array.isArray(this.table['mapped_table_name']) ? this.table['mapped_table_name'][0] : this.table['mapped_table_name'],
      custom_table_name: this.tableName.value,
      calculated_column_name:  this.allowMultiColumn ? this.chips.map(value => value.columnName) : [this.columnName.value],
      formula: this.allowMultiColumn ?  this.chips.map(value => value.formula) :  [this.queryTextarea.value],
      custom_table_id: this.table['custom_table_id'] || ''
    }

    // if (!this.validateColumnData(data)) return;

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

    if((value || '').trim()){

      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      // let key = this.oldValue.filter((data, key) => {
      //   if(data === value){
      //     return key
      //   }
      // });
      this.current = this.oldValue[this.oldValue.length-1]
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      this.suggestionList = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
    }

  }

  private getSearchedInput(value: any) {
    let functionArr = [],columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    columnList = this.table['mapped_column_name'].filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    });
    return [{ groupName:'Functions',values:functionArr},{groupName: 'Columns',values:columnList} ];
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
    


    // if(event.option.value === '(')
    //   this.bracketStack['open'].push(event.option.value);
    // else if(event.option.value === ')')
    //   this.bracketStack['close'].push(event.option.value);

      // this.hasError();
      
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  public checkDuplicate(value,type) {

    // if(this.allowMultiColumn){
    //   return;
    // }

    if((value || '').trim() && this.curentName !== value){
        let currentList = this.chips.filter((element, key) => {
            if(type === 'column'){
              return value.trim().toLowerCase() === element['name'].trim().toLowerCase();
            }else{
              return value.trim().toLowerCase() === element['formula'].trim().toLowerCase();
            }
        });
        let existingList = this.customTable.filter(element => {
          if(type === 'table'){
            return value.toLowerCase() === element['custom_table_name'].toLowerCase();
          }else if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          if(type === 'column')
            this.columnName.setErrors({'incorrect': false})
          if(type === 'table' && !this.allowMultiColumn)
            this.tableName.setErrors({'incorrect': false});
          else
            this.queryTextarea.setErrors({'incorrect': false});
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
        }
    
      }else
        type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
    
      }



  public getDetails(event){
    let ids = [];

      ids = this.tables.map(table => {
      if(event.split('.')[0] === table.alias)
      return table.id;
    })
    this.columnUsed.push(event.split('.')[1])
    this.tableUsed.push(...ids);
    let unique = [...new Set(this.tableUsed)];
    this.columnUsed = [...new Set(this.columnUsed)]
    unique = unique.filter(element => {
      return element !== undefined 
    });
    this.tableUsed = unique;

  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
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
    // const table = this.tableName.value;
    const input = this.columnName.value;
    const value = this.queryTextarea.value;
    
    if ((value || '').trim() && (input || '').trim()) {
      if(this.checkDuplicateChip(input)){
       let tableUsed =  this.tableUsed;
       let columnUsed = this.columnUsed
        this.chips.forEach(chip => {
          if(chip['tableName'].toLowerCase() === input.toLowerCase()){
            {
              chip['columnName'] = input.trim(),
              chip['formula']  = value.trim()
              // chip['tableName'] = table.trim()
          }
        }
        })
      }else{
        this.chips.push(
          {formula: value.trim(),columnName: input.trim()}
        );
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