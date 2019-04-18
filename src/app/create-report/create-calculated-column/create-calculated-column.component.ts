import { Component, OnInit, Input, SimpleChange, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { MatStepper } from "@angular/material";

import { sqlFunctions } from "../../../constants";
import { SharedDataService } from "../shared-data.service";
import { CreateCalculatedColumnService } from "./create-calculated-column.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-create-calculated-column",
  templateUrl: "./create-calculated-column.component.html",
  styleUrls: ["./create-calculated-column.component.css"]
})
export class CreateCalculatedColumnComponent implements OnInit {

  public suggestionList: any[] = [];

  oldValue:any;
  bracketStack:any = {
                'open' : [],
                'close' : []
  };
  current;
  tableId;
  selectedTables = [];
  columnUsed =[];
  confirmFn;
  keyChips = [];
  isError:boolean;
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  columnName:  FormControl = new FormControl();
  tableControl: FormControl = new FormControl('',[Validators.required]);
  private functions = sqlFunctions;
  public tables = [];
  public columns = [];
  public chips = [];
  visible = true;
  tableUsed = [];
  selectable = true;
  curentName:string = '';
  removable = true;

  confirmText:string = 'Are you sure you want to delete the existing calculated field?';
  confirmHeader:string = 'Delete existing calculated field';

  fieldId: number;

  constructor( private sharedDataService:SharedDataService,
              private calculatedColumnReportService:CreateCalculatedColumnService,
              private toasterService: ToastrService
            ) {}


  ngOnInit() {

    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      let tableIds = this.tables.map(table =>{
                        return table.id
                    });
      this.getExistingList(tableIds);
    })

    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      this.columns = this.getColumns();
      let formulaCalculated = this.sharedDataService.getFormulaCalculatedData();
      this.removeDeletedTableData(formulaCalculated);
    });
    
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if((value || '').trim())
          this.existingList = this.searchedExistingList(value);
        else
          this.existingList = this.originalExisting;
      });

    this.columnName.valueChanges.subscribe(value => {
      this.checkDuplicate(value,'column');
    });
  }

  public removeDeletedTableData(data){
    let isChips = false;
    for(let key in data){
      if(!(this.selectedTables.find(table => 
        // table['table']['select_table_id'].toString().includes(key)
        key.includes(table['table']['select_table_id'].toString())
      )))
      {
        delete data[key];
        this.queryTextarea.setValue('');
        this.columnName.setValue('');
        this.tableControl.setValue('');
      }
    }
    this.chips = [];
    for(let d in data){
      this.chips.push(...data[d]);
    }
  }


  private isEmpty(data){
for(let key in data){
  if(data.hasOwnProperty(key)){
    return false;
  }
}
return true;
  }

  public searchedExistingList(value:string){
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }

  public getTables() {  
    return this.selectedTables.map(element => {
      return {
        'name' : element['table']['select_table_name'],
        'id': element['table']['select_table_id'],
        'alias': element['select_table_alias']
      };
    });
  }


  public getColumns() {
    let columnData = [];

    let columnWithTable = this.selectedTables.map(element => {
        return element['table']['mapped_column_name'].map(column => {
          return `${element['select_table_alias']}.${column}`
        });
    });
    columnWithTable.forEach(data =>{
      columnData.push(...data);
    });
    
    return columnData;
  }

  public getExistingList(id){
    let ids = {'table_ids':id}
    this.calculatedColumnReportService.getCalculatedFields(ids).subscribe(res => {
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
      this.existingList.forEach(element => {
        if((this.chips.find(chip => 
          chip['name'].toString().includes(element['calculated_field_name'])
        ))){
          element.checked = true;
        }
      })
    });
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
    columnList = this.columns.filter(element => {
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
    


    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);

      // this.hasError();
      
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
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

  private setSelectValue(value){
    this.queryField.setValue(value);
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      if(this.bracketStack['open'].length === this.bracketStack['close'].length){
        this.isError = false;
      }
      else{
        this.isError = true;
      }
    }
  };


  public toggle(item,event){
    if(event.checked){
      this.columnName.setValue(item.calculated_field_name);
      this.queryTextarea.setValue(item.calculated_field_formula);
      this.tableUsed = item.table_list
      this.columnUsed = item.column_used 
      this.add();
    }else{
      let obj = {name: item.calculated_field_name.trim(),formula: item.calculated_field_formula.trim()};
      this.remove(obj);
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
  }

  remove(tag) {
    const index = this.chips.findIndex(x => x.name === tag.name);
    if(tag.name === this.columnName.value){
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
      if((this.chips.find(chip => 
       chip['name'].toLowerCase().includes(input.toLowerCase())
      ))){
       let tableUsed =  this.tableUsed;
       let columnUsed = this.columnUsed
        this.chips.forEach(chip => {
          if(chip['name'].toLowerCase() === input.toLowerCase()){
            {
              chip['name'] = input.trim(),
              chip['formula']  = value.trim(),
              chip['tableUsed'] = tableUsed,
              chip['columnUsed'] = columnUsed
          }
        }
        })
      }else{
        this.chips.push(
          {name: input.trim(),formula: value.trim(),tableUsed:this.tableUsed,columnUsed:this.columnUsed, id: 0}
        );
      }
      
    }

    if (this.columnName.value) {
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
      this.tableUsed = [];
      this.columnUsed = [];
    }

    
  }

  public getSelected(chip){
    this.curentName = chip.name;
    this.columnName.setValue(chip.name);
    this.queryTextarea.setValue(chip.formula);
  }

  public checkDuplicate(value,type) {

    if((value || '').trim() && this.curentName !== value){
        let currentList = this.chips.filter((element, key) => {
            if(type === 'column'){
              return value.trim().toLowerCase() === element['name'].trim().toLowerCase();
            }else{
              return value.trim().toLowerCase() === element['formula'].trim().toLowerCase();
            }
        });
        let existingList = this.existingList.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          type === 'column'?this.columnName.setErrors({'incorrect': false}):this.queryTextarea.setErrors({'incorrect': false});
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
        }
    
      }else
        type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
    
      }

      public next(){
        this.add();
        // this.getFormatData();
        let formula = [];
        this.chips.forEach(element => {
          formula.push(`(${element.formula}) ${element.name}`);
        });
        this.sharedDataService.setFormula(['select','calculated'],formula);
        let tableId = this.tableId;

        let formulaList = {};
        formulaList[tableId] = formula;

        this.keyChips = this.getKeyWise()
        
        this.sharedDataService.setFormulaCalculatedData(this.keyChips);
        this.sharedDataService.setCalculatedData(this.getFormatData());
      }

      private getKeyWise(){
         return this.chips.reduce(function(rv, x){
           (rv[x['tableUsed']] = rv[x['tableUsed']] || []).push(x);
           return rv;
         }, {});

      };
  
      public getNewFields(){
        let newColumns = [];
        let existingList = this.existingList;
        this.chips.forEach(element => {
          let isExist = false;
          existingList.forEach(list => {
            if(element.name === list.calculated_field_name){
              isExist = true;
            }
          })
          if(!isExist)
            newColumns.push(element);
        });
        return newColumns;
      }

      private getField(type,newFeilds){

        let newArr = newFeilds.map(element => {
          if(type === 'name')
            return element.name;
          else
            return element.formula;
        });
        return newArr;
      }

  private getFormatData() {
    let newFeilds = this.getNewFields();

    let columns = this.columns;
    let obj = [];
    // newFeilds.forEach(element=>{
    //   obj.push({
    //     'calculted_id': 0,
    //     'calculated_field_name' : element.name,
    //     'sl_table_id': element.tableUsed,
    //     'columns_used_calculate_column': element.columnUsed,
    //     'calculated_field_formula': element.formula,
    //     'applied_flag_calculate_column': true
    //   })
    // })
    newFeilds.forEach(element=>{
      obj.push({
        'calculated_field_id': element.id,
        'calculated_field_name' : element.name,
        'sl_table_id': element.tableUsed,
        'columns_used_calculate_column': element.columnUsed,
        'calculated_field_formula': element.formula,
        'applied_flag_calculate_column': true
      })
    })

  if(this.chips){
    obj.push(...this.sharedDataService.getExistingColumns());
  }
    
    return obj;
  }

  public deleteField(id){
    Utils.showSpinner();
    this.calculatedColumnReportService.deleteField(id).subscribe(response => {
      this.toasterService.success(response['detail'])
      Utils.hideSpinner();
      Utils.closeModals();
      let tableIds = this.tables.map(table =>{
        return table.id
    });
      this.getExistingList(tableIds);
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
    });
  }


}

