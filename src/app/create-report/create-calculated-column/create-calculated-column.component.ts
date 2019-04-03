import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { sqlFunctions } from "../../../constants";
import { SharedDataService } from "../shared-data.service";
import { CreateCalculatedColumnService } from "./create-calculated-column.service";

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
  selectedTables = [];
  isError:boolean;
  existingList:any[] = [];
  originalExisting:any[] = [];
  queryField: FormControl = new FormControl();
  queryTextarea: FormControl = new FormControl();
  columnName:  FormControl = new FormControl();
  tableControl: FormControl = new FormControl('',[Validators.required]);
  private functions = sqlFunctions;
  public tables = ['Table1','Table2','Table3','Table4'];
  private isNew:boolean = true;
  // public columns = [{'name':'column1','checked':false},{'name':'column2','checked':false},{'name':'column3','checked':false}];
public columns = [];
  public chips = [];

  constructor(private sharedDataService:SharedDataService,private calculatedColumnReportService:CreateCalculatedColumnService) {}

  ngOnInit() {

    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
    });

    
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        
        if((value || '').trim())
          this.existingList = this.getExistingList(value);
        else
        this.existingList = this.originalExisting;
        
      });

    this.columnName.valueChanges.subscribe(value => {
      // this.checkDuplicateColumn(value);
      this.checkDuplicate(value,'column');
    });

  }

  public getExistingList(value:string){
    return this.originalExisting.filter(option =>
      option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
    )
  }


  public getTables() {

  return this.selectedTables.map(element => {
      return element['table']['mapped_table_name'];
    });
  }

  public onTableSelection(selected){
    // this.columns = this.selectedTables.filter(element => {
    //   if(selected.value === element['table']['mapped_table_name'])
    //     return (...element['columns'])
    // });

    // this.columns = [];
    // this.selectedTables.find(table => {
    //   if(selected.value === table['table']['mapped_table_name']){
    //   //   this.columns.push(...table['columns']);
    //   console.log('asjhdkashd', this, table, table['columns'])
    //   }

    // })



    let temp = this.selectedTables.find(table => selected.value === table['table']['mapped_table_name']);


    this.columns.push(...temp['columns'])


    this.calculatedColumnReportService.getCalculatedFields().subscribe(res => {
      this.existingList = res['data'];
      this.originalExisting = JSON.parse(JSON.stringify(this.existingList));
      
    })
  }

  public inputValue(value){
    if((value || '').trim()){
    this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
    this.oldValue.forEach(element => {
      element + ' ';
    });
    this.current = this.oldValue[this.oldValue.length-1];
   this.results =  this.getSearchedInput(this.oldValue[this.oldValue.length-1]);
  }else{
    this.results = [{ groupName:'Functions',values:[]},{groupName: 'Columns',values:[]} ];
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
    // let oldValue = this.queryTextarea["value"].split(/(\s+)/).filter(e => e.trim().length > 0);
    let index = this.oldValue.length > 0?this.oldValue.length-1:0;
    // this.oldValue[index] = event.option.value;
    // this.setTextareaValue(
    
    
    // this.oldValue[this.oldValue['length']-1] = event.option.value;
    // this.setTextareaValue(event.option.value + " ");
    this.oldValue[index] = event.option.value + '  ';
    
    this.setTextareaValue(this.oldValue.join(' ').split(',').map(f => f)[0]);
    

    if(event.option.value === '(')
      this.bracketStack['open'].push(event.option.value);
    else if(event.option.value === ')')
      this.bracketStack['close'].push(event.option.value);

      this.hasError();
      // this.checkDuplicateFormula(this.oldValue.join(' ').split(',').map(f => f.trim())[0]);
      this.checkDuplicate(this.oldValue.join(' ').split(',').map(f => f.trim())[0],'formula');
  }

  private setTextareaValue(value){
    this.queryTextarea.setValue(value);
  }

  private setSelectValue(value){
    this.queryField.setValue(value);
  }

  // public changeOwner(event) {
  //   if (
  //     (event.keyCode >= 48 && event.keyCode <= 57) ||
  //     event.keyCode === 8 ||
  //     event.keyCode === 32
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

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


  public toggle(item,event){
    if(event.checked){
    this.columnName.setValue(item.calculated_field_name);
    this.queryTextarea.setValue(item.calculated_field_formula);
    this.add();
    }else{
      let obj = {name: item.calculated_field_name.trim(),formula: item.calculated_field_formula.trim()};
      this.remove(obj);
    this.columnName.setValue('');
    this.queryTextarea.setValue('');
    // this.columnName.setValue(chip.name);
    //  this.queryTextarea.setValue(chip.formula);
    
    }
    this.isNew = false;
  }

  remove(tag) {
    // const index = this.chips.indexOf(tag);
    const index = this.chips.findIndex(x => x.name === tag.name);
    
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

//   public checkDuplicateColumn(value) {
// if((value || '').trim()){
//     let currentList = this.chips.filter((element, key) => {
//       // if (key != index)
//         return value === element['name'];
//     });
//     let existingList = this.existingList.filter(ele => {
//       return value === ele['calculated_field_name'];
//     });

//     if (currentList.length > 0 || existingList.length > 0) {
//       this.columnName.setErrors({'incorrect': false});
//       // return true;
//     } else {
//       this.columnName.setErrors(null);
//       // return false;
//       // this.getCreateCalculatedQuery();
//     }

//   }else

//     this.columnName.setErrors(null);

//   }

//   public checkDuplicateFormula(value) {

    
//     if((value || '').trim()){
//       let currentList = this.chips.filter((element, key) => {
//         // if (key != index)
//           return value === element['formula'];
//       });
//       let existingList = this.existingList.filter(ele => {
//         return value === ele['calculated_field_formula'];
//       });
  


//       if (currentList.length > 0 || existingList.length > 0) {
//         this.queryTextarea.setErrors({'incorrect': false});
//         // return true;
//       } else {
//         this.queryTextarea.setErrors(null);
//         // return false;
//         // this.getCreateCalculatedQuery();
//       }
  
//     }else
  
//       this.queryTextarea.setErrors(null);
  
//   }


  public checkDuplicate(value,type) {


    if((value || '').trim() && this.isNew){
        let currentList = this.chips.filter((element, key) => {
          // if (key != index)
            // return value === (type === 'column'?element['name']:element['calculated_field_formula']);
            if(type === 'column'){
              return value.toLowerCase() === element['name'].toLowerCase();
            }else{
              return value.toLowerCase() === element['formula'].toLowerCase();
            }
        });
        let existingList = this.existingList.filter(element => {
          // return value === (type === 'column'?element['calculated_field_name']:element['calculated_field_formula']);
          if(type === 'column'){
            return value.toLowerCase() === element['calculated_field_name'].toLowerCase();
          }else{
            return value.toLowerCase() === element['calculated_field_formula'].toLowerCase();
          }
        });
    
        if (currentList.length > 0 || existingList.length > 0) {
          type === 'column'?this.columnName.setErrors({'incorrect': false}):this.queryTextarea.setErrors({'incorrect': false});
          // return true;
        } else {
          type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
          // return false;
          // this.getCreateCalculatedQuery();
        }
    
      }else
    
      type === 'column'?this.columnName.setErrors(null):this.queryTextarea.setErrors(null);
      this.isNew = true;
    
      }


      public formCalculatedFormula(){
      let formula = '';
        this.chips.forEach(element => {
          formula = formula + '(' +element.formula + ')' + ' ' + element.name + ' ';
        });
        
      }

public next(){
let formula = [];
this.chips.forEach(element => {
  // formula.push('(' +element.formula + ')' + ' ' + element.name);

  formula.push(`(${element.formula}) ${element.name}`);
});
this.sharedDataService.setFormula(['select','calculated'],formula);

}
  
}
