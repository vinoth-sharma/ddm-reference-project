import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { SharedDataService } from "../shared-data.service";
import { CreateCalculatedColumnService } from "./create-calculated-column.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";
import { ConstantService } from '../../constant.service';
import { SemdetailsService } from '../../semdetails.service'


@Component({
  selector: "app-create-calculated-column",
  templateUrl: "./create-calculated-column.component.html",
  styleUrls: ["./create-calculated-column.component.css"]
})
export class CreateCalculatedColumnComponent implements OnInit {

  public suggestionList: any[] = [];
  oldValue:any;
  selectedTables = [];
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl('');  
  columnName:  FormControl = new FormControl();
  private functions = [];
  public tables = [];
  public columns = [];
  public chips = [];
  selectable = true;
  curentName:string = '';
  removable = true;
  confirmText:string = 'Are you sure you want to delete the existing calculated field?';
  confirmHeader:string = 'Delete existing calculated field';
  fieldId: number;
  lastWord = '';
  isExistingLoading:boolean = false;
  isAllChecked:boolean = false;
  aggregationPresence: boolean = false;
  public calculatedFieldsNonAggregationsCase : any = [];
  public calculatedFieldsAggregationsCase : any = [];
  public calculatedFieldsNonAggregationsCaseUnique : any =[];
  public calculatedFieldsNonAggregationsCaseUniqueGroupBy : any =[];
  public deleteChipsProcess : any = false;
  public deletingNonAggregationFn : any = '';
  public aggregationType : Boolean = false;
  columnList: any[];
  functionArr: any[];

  constructor( 
    private sharedDataService:SharedDataService,
    private calculatedColumnReportService:CreateCalculatedColumnService,
    private toasterService: ToastrService,
    private constantService: ConstantService,
    private semDetailsService: SemdetailsService,
  ) {
      this.functions = this.constantService.getSqlFunctions('aggregations');
    }

  ngOnInit() {
    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      this.getExistingList(this.getTableIds());
    })

    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      this.columns = this.getColumns();
      console.log(this.tables,this.columns,"updated");
      
      this.removeDeletedTableData(this.sharedDataService.getFormulaCalculatedData());
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

    this.sharedDataService.resetQuerySeleted.subscribe(ele=>{
      this.chips = [];
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
      this.existingList = [];
    });

  }

  public removeDeletedTableData(data){
    let isChips = false;
    for(let key in data){
      if(!(this.selectedTables.find(table => 
        key.includes(table['table']['select_table_id'].toString())
      )))
      {
        delete data[key];
        this.queryTextarea.setValue('');
        this.columnName.setValue('');
      }
    }
    this.chips = [];
    for(let d in data){
      this.chips.push(...data[d]);
    }

    this.next();
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

    // console.log("SHOWING CLOUMNS : ",columnData);
    
    
    return columnData;
  }

  public getExistingList(id){
    this.isExistingLoading = true;
    let ids = {'table_ids':id}
    this.calculatedColumnReportService.getCalculatedFields(ids).subscribe(res => {
      this.existingList = [];
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
      this.existingList.forEach(element => {
        if((this.chips.find(chip => 
          chip['name'].toString().includes(element['calculated_field_name'])
        ))){
          element.checked = true;
        }
      })
      this.isExistingLoading = false;
    });
  }

  public inputValue(event, value){
    this.setTextareaValue(value);
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
      this.checkIsExisting();
      this.lastWord = value;
      this.oldValue = word.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.suggestionList =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
    }else{
      this.suggestionList = this.getSearchedInput('');
    }

  }

  checkIsExisting() {
    let columnName = this.columnName.value;
    let ele = this.chips.filter(data => {
      if(columnName.toLowerCase() === data.name && data.isExist) {
        return data;
      }
    });
    if(ele.length) {
      this.columnName.setValue('');
    }
  }

  private getSearchedInput(value: any) {
    this.functionArr = []
    this.columnList = [];
    let calcList = [];

    this.chips.forEach(element => {
      if (element.name.toLowerCase().includes(value.toLowerCase())) {
        calcList.push(element);
      }
    });    
    this.functions.forEach(element => {
      if(!value || element.name.toLowerCase().includes(value.toLowerCase())) {
                this.functionArr.push(element);
              } 
    });
    this.columnList =  this.columns.filter(element => {
                      return (!value || element.toLowerCase().includes(value.toLowerCase()))
                    }).map(ele => {
                      return {'name':ele,'formula':ele}
                  });

    return [{ groupName:'Functions',values:this.functionArr},{groupName: 'Columns',values:this.columnList},
            {groupName: 'Calculated Columns', values:calcList}];
  }

  public onSelectionChanged(event) {
    // console.log(event);
    //column name with space handler
    let eventValue = event.option.value;
    // if(event.option.group.label === "Columns")
    // {
    //   eventValue = this.columnNameWithSpaceHandler(event.option.value);
    // }
    
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }

    console.log(this.oldValue);
    console.log(this.lastWord);
    
    let query = <HTMLInputElement>document.getElementById('cccId');
    let i;
    let value = this.lastWord.split(" ");
    console.log(value);
    
    for ( i = 0;i < value.length;i++) {
      if(value[i] == this.oldValue) {
        value[i] = eventValue + ' ';
        break;
      }
    }
    
    this.setTextareaValue(value.join(' '));
    
  }

  public getDetails(event){
     let tId, cId;
     tId = this.tables.map(table => {
            if(event.split('.')[0] === table.alias)
              return table.id;
            });
      cId = event.split('.')[1];
      return {'table': tId, 'column': cId}
  }

  private isColumn(item){
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  public toggle(item,event){
    item.checked = event.checked;
    this.checkIsAllChecked();
    if(event.checked){
      this.columnName.setValue(item.calculated_field_name);
      this.queryTextarea.setValue(item.calculated_field_formula);
      this.add(true);
    }else{
      let obj = {name: item.calculated_field_name.trim(),formula: item.calculated_field_formula.trim()};
      this.remove(obj);
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
  }

  checkIsAllChecked () {
    if(this.existingList.filter(element => element.checked).length  === this.existingList.length) {
      this.isAllChecked = true;
    }else {
      this.isAllChecked = false;
    }
  }

  remove(tag) {
    this.deleteChipsProcess = true
    const index = this.chips.findIndex(x => x.name === tag.name);
    let existingIndex = this.existingList.findIndex(x => x.calculated_field_name === tag.name);
    this.deletingNonAggregationFn = this.chips[0]['formula'];
    if(existingIndex != -1){
      this.existingList[existingIndex].checked = false;
      this.checkIsAllChecked();
    }
    if(tag.name === this.columnName.value){
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
    this.next();
  }

  checkDuplicateChip(input) {
    let isChipDuplicate = false;
    this.chips.forEach(data => {
      if(data['name'].toLowerCase() === input.toLowerCase()) {
        isChipDuplicate = true;
      }
    })
    return isChipDuplicate;
  }

  getTableUsed(value) {
    let ids,tableUsed = [],columnUsed = [];
    let values = value ? value.split(" "): [];
    for(let i =0; i< values.length;i++) {
      if(values[i].trim() && this.isColumn(values[i].trim())){
       ids = this.getDetails(values[i]);
       tableUsed.push(...ids['table']);
       columnUsed.push(ids['column']);
      }
    }
    tableUsed = tableUsed.filter(data => { 
      return data !== undefined;
    });
    columnUsed = columnUsed.filter(data => { 
      return data !== undefined;
    })
    return {'table':  tableUsed, 'column': columnUsed }
  }

  public add(isExist = false){
    const input = this.columnName.value ? this.columnName.value : '';
    const value = this.queryTextarea.value;
    let usedDetails= this.getTableUsed(value);

    if ((input || '').trim() || (value || '').trim()) {    
      if(this.checkDuplicateChip(input)){
        this.chips.forEach(chip => {
          if(chip['name'].toLowerCase() === input.toLowerCase()){
            {
              chip['name'] = input.trim(),
              chip['formula']  = value.trim(),
              chip['tableUsed'] = usedDetails['table'].length ? Array.from(new Set(usedDetails['table'])): this.getTableIds(),
              chip['columnUsed'] = usedDetails['column'].length ? Array.from(new Set(usedDetails['column'])) : []
          }
        }
        })
      }else{
        this.chips.push(
          {
            name: (input ? input.trim(): ''),
            formula: value.trim(),
            tableUsed: usedDetails['table'].length ? Array.from(new Set(usedDetails['table'])): this.getTableIds(),
            columnUsed: usedDetails['column'].length ? Array.from(new Set(usedDetails['column'])) : [],
            id: 0,
            isExist : isExist
          }
        );
      }
      
    }
      this.columnName.setValue('');
      this.queryTextarea.setValue(' ');
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
              return  (value.trim().toLowerCase() === element['formula'].trim().toLowerCase()  && this.curentName.trim().toLowerCase() !== element['name'].trim().toLowerCase());
            }
        });
        let existingList = this.existingList.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        let tableList = this.tables.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element['name'].toLowerCase();
          }
        });

        let columnList = this.columns.filter(element => {
          if(type === 'column'){
            return value.toLowerCase() === element.split('.')[1].toLowerCase();
          }
        });

        if (currentList.length > 0 || existingList.length > 0 || tableList.length > 0 || columnList.length > 0) {
          if(type === 'column') {
            this.columnName.setErrors({'incorrect': false});
          }else {
            return true;
          };
        } else {
          if(type === 'column') {
            this.columnName.setErrors(null)
          }else {
            return false;
          }
        }
    
      }else
        if(type === 'column') {
          this.columnName.setErrors(null)
        } else {
          return false;
        }
    
      }

      public next(){
        this.tables = this.getTables();       
        this.columns = this.getColumns();
        this.add();
        let formula = [];
        let calcNames = [];
        this.chips.forEach(element => {
          formula.push(`${element.formula} ${this.columnAliasSpaceQuoter(element.name)}`);          
        });
        this.chips.forEach(element => {
          calcNames.push({ name : element.name, formula : element.formula});          
        });
        let keyChips = this.getKeyWise();
        let formatData = this.getFormatData();

        //remove space with key
        calcNames.forEach(row=>{
          row.formula = this.columnNameWithSpaceHandler(row.formula)
        })
        formula = formula.map(l_formula=>this.columnNameWithSpaceHandler(l_formula)) 
        formatData.forEach(data=>{
          data.calculated_field_formula = this.columnNameWithSpaceHandler(data.calculated_field_formula)
        })
        for(let i in keyChips){
          keyChips[i].forEach(keychip => {
             keychip.formula = this.columnNameWithSpaceHandler(keychip.formula) 
          });
        }

        this.sharedDataService.setCalcData(calcNames);
        this.sharedDataService.setFormula(['select','calculated'],formula);
        this.sharedDataService.setFormulaCalculatedData(keyChips);

        let temp = this.sharedDataService.getFormulaObject();
        this.sharedDataService.setCalculatedData(formatData);
        $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
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

  private getFormatData() {
    let newFeilds = this.getNewFields();

    let columns = this.columns;
    let obj = [];
    newFeilds.forEach(element=>{
      if(element.name) {
        obj.push({
          'calculated_field_id': element.id,
          'calculated_field_name' : element.name,
          'sl_table_id': element.tableUsed,
          'columns_used_calculate_column': element.columnUsed,
          'calculated_field_formula': element.formula,
          'applied_flag_calculate_column': true
        })
      }
    })

    // if(this.chips){
    //   // obj.push(...this.sharedDataService.getExistingColumns());
    // }
    
    return obj;
  }

  public deleteField(id){
    Utils.showSpinner();
    this.calculatedColumnReportService.deleteField(id).subscribe(response => {
      this.toasterService.success(response['detail'])
      Utils.hideSpinner();
      Utils.closeModals();
      this.getExistingList(this.getTableIds());
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
    });
  }

  getTableIds() {
    let tableIds = this.tables.map(table =>{
      return table.id
    });
    return tableIds;
  }

  toggleAll(event) {
    this.isAllChecked = event.checked;
    this.columnName.setValue('');
    this.queryTextarea.setValue('');
    if(this.isAllChecked) {
      this.existingList.forEach(element => {
        element.checked = event.checked;
        this.columnName.setValue(element.calculated_field_name);
        this.queryTextarea.setValue(element.calculated_field_formula);
        this.add(true);
      });
    } else {
      this.existingList.forEach(element => {
        element.checked = event.checked;
        let obj = {name: element.calculated_field_name.trim(),formula: element.calculated_field_formula.trim()};
        this.remove(obj);
      });
    }
  }

  columnAliasSpaceQuoter(value){
    // // console.log(value);
    let val = value?value.trim():'';
    let regex = /\s/;
    if(regex.test(val))
      return JSON.stringify(value)
    else
     return val
  }

  // columnNameWithSpaceHandler(value){
  //   let key = "_dummy_"
  //   let flag = value.indexOf(key) === -1?false:true;
  //   if(!flag){
  //     return value 
  //   }
  //   else{
  //     let regEx = new RegExp(key,"g");
  //     let l_value = value.replace(regEx," ")
  //     // this.columnMappingObj.push(value)
  //     return l_value    
  //   }
  // }

  columnNameWithSpaceHandler(val){
    let columns = this.getColumns();
    let l_value = val;
    let key = "_dummy_"
      let regEx = new RegExp(key,"g");
    columns = columns.filter(col=>{
      return col.indexOf(key) === -1?false:true;
    })
    
    columns.forEach(column=>{
      let l_col = column.replace(regEx," ");
      let regEx1 = new RegExp(l_col,"g");
      l_value = l_value.replace(regEx1,column)
    })
      return l_value    
    }

}