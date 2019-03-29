import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { sqlFunctions } from "../../../constants";
import { SharedDataService } from "../shared-data.service";
import { CalculatedColumnReportService } from "../calculated-column-report/calculated-column-report.service";

@Component({
  selector: "app-create-calculated-column",
  templateUrl: "./create-calculated-column.component.html",
  styleUrls: ["./create-calculated-column.component.css"]
})
export class CreateCalculatedColumnComponent implements OnInit {
  results: any[] = [];
  oldValue:any;
  bracketStack:any = {
                'open' : [],
                'close' : []
  };
  current;
  isError:boolean;
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  columnName:  FormControl = new FormControl();
  private functions = sqlFunctions;
  public tables = ['Table1','Table2','Table3','Table4'];
  public columns = [{'name':'column1','checked':false},{'name':'column2','checked':false},{'name':'column3','checked':false}];

  public chips = [];

  constructor(private sharedDataService:SharedDataService,private calculatedColumnReportService:CalculatedColumnReportService) {}

  ngOnInit() {
    this.tables = this.getTables();
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value,'value');
        
        if((value || '').trim())
          this.existingList = this.getExistingList(value);
        else
        this.existingList = this.originalExisting;
        console.log(this.existingList,'existingList');
        
      });

    this.columnName.valueChanges.subscribe(value => {
      this.checkDuplicateColumn(value);
    });

  }

  public getExistingList(value:string){
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }


  public getTables() {
    let tables = [];
  let selectedTables = this.sharedDataService.getSelectedTables();
  selectedTables.forEach(element => {
      tables.push(element['table']['mapped_table_name']);
    });

    return tables;
  }

  public onTableSelection(value){
    this.sharedDataService.getSelectedTables().forEach(element => {
      this.columns.push(...element['columns']);
    });
    this.calculatedColumnReportService.getCalculatedFields().subscribe(res => {
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
      
    })
  }

  public inputValue(value){
    this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
    this.oldValue.forEach(element => {
      element + ' ';
    });
    this.current = this.oldValue[this.oldValue.length-1];
   this.results =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
  }

  private getSearchedInput(value: any) {
    let functionArr = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    return functionArr;
  }

  public onSelectionChanged(event) {
    if (this.queryTextarea["value"] === null) {
      this.setTextareaValue("");
    }
    // let oldValue = this.queryTextarea["value"].split(/(\s+)/).filter(e => e.trim().length > 0);
    console.log(this.oldValue);
    let index = this.oldValue.length-1;
    // this.oldValue[index] = event.option.value;
    console.log(this.oldValue[index],'queryTextarea',this.queryTextarea);
    // this.setTextareaValue(
    
    
    // this.oldValue[this.oldValue['length']-1] = event.option.value;
    // this.setTextareaValue(event.option.value + " ");
    this.oldValue[index] = event.option.value + '  ';
    // console.log(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'new');
    
    this.setTextareaValue(this.oldValue.join(' ').split(',').map(f => f)[0]);
    

    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);

      this.hasError();
      this.checkDuplicateFormula(this.oldValue.join(' ').split(',').map(f => f)[0]);
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  private setSelectValue(value){
    this.queryField.setValue(value);
  }

  public changeOwner(event) {
    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode === 8 ||
      event.keyCode === 32
    ) {
      return true;
    }
    return false;
  }

  public hasError = () => {
    if (this.queryTextarea.value) {
      // let splitWord = this.queryTextarea.value
      //   .split(/(\s+)/)
      //   .filter(e => e.trim().length > 0);
      // let functionArr = {};
      // splitWord.forEach((element, index) => {
      //   functionArr[index] = [];
      //   for (let key in this.functions) {
      //     functionArr[index].push(
      //       ...this.functions[key].filter(
      //         option =>
      //           // option.toLowerCase().includes(element)
      //           option.toLowerCase() === element.toLowerCase()
      //       )
      //     );
      //   }
      // });
      if(this.bracketStack['open'].length === this.bracketStack['close'].length){
        this.isError = false;
      }
      else{
        this.isError = true;
      }
    }
  };


  public toggle(item){
    this.columnName.setValue(item.calculated_field_name);
    this.queryTextarea.setValue(item.calculated_field_formula);
  }

  remove(tag): void {
    const index = this.chips.indexOf(tag);

    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  visible = true;
  selectable = true;
  removable = true;
  // addOnBlur = true;
  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
 

  public add(){
    const input = this.columnName.value;
    const value = this.queryTextarea.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.chips.push({name: input.trim(),formula: value.trim()});
    }

    // Reset the input value
    if (this.columnName.value) {
      this.columnName.setValue('');
      this.queryTextarea.setValue('');
    }

   
  }

  public getSelected(chip){
     this.columnName.setValue(chip.name);
     this.queryTextarea.setValue(chip.formula);
  
  }

  public checkDuplicateColumn(value) {
if((value || '').trim()){
    let currentList = this.chips.filter((element, key) => {
      // if (key != index)
        return value === element['name'];
    });
    let existingList = this.existingList.filter(ele => {
      return value === ele['calculated_field_name'];
    });

    if (currentList.length > 0 || existingList.length > 0) {
      this.columnName.setErrors({'incorrect': false});
      // return true;
    } else {
      this.columnName.setErrors(null);
      // return false;
      // this.getCreateCalculatedQuery();
    }

  }else

    this.columnName.setErrors(null);

  }

  public checkDuplicateFormula(value) {

    
    if((value || '').trim()){
      let currentList = this.chips.filter((element, key) => {
        // if (key != index)
          return value === element['formula'];
      });
      let existingList = this.existingList.filter(ele => {
        return value === ele['calculated_field_formula'];
      });
  
      if (currentList.length > 0 || existingList.length > 0) {
        this.queryTextarea.setErrors({'incorrect': false});
        // return true;
      } else {
        this.queryTextarea.setErrors(null);
        // return false;
        // this.getCreateCalculatedQuery();
      }
  
    }else
  
      this.queryTextarea.setErrors(null);
  
  }



  
}
