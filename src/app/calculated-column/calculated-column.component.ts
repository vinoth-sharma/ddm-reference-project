import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { sqlFunctions } from '../../constants';

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css'],
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};
  @Input() allowMultiColumn:boolean;
  @Output() save = new EventEmitter();

  public columns: any = [];
  public selectedColumns: any = [];
  public columnNames: any;
  public tableName: string;
  public selected: string;
  public category: string;
  public isCollapsed: boolean;
  public semanticId: number;
  public formulas:any;
  public customInput:string = '';
  public selectedCustomInput:any = [];
  public formulaColIndex:number = 0;
  public formulaIndex:number = 0;
  public isReplace:boolean = false;

  public functionsList = sqlFunctions;

  constructor(private activatedRoute: ActivatedRoute, private toasterService: ToastrService) {
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];
  }

  ngOnInit() { }

  ngOnChanges() {
    this.reset();
  }

  public onSelect(selected: string) {
    if (selected) {
      if (this.isColumn(selected)) {
        if (!this.selectedColumns.includes(selected)) {
          this.selectedColumns.push(selected);
        }
        else {
          this.toasterService.error('Column already selected');
        }
      }
      else {
        this.toasterService.error('Please select a valid column');
      }
    }
    this.selected = '';
  }

  public isColumn(item: string) {
    return this.columns.map(col => col.toUpperCase().trim())
      .includes(item.toUpperCase().trim());
  }

  public deleteSelectedColumn(index: number) {
    // get the selected item
    let selected = this.selectedColumns.splice(index, 1).shift();

    // if (this.formulaColumns.includes(selected)) {
    //   this.deleteFormulaColumn();
    // }
  }

  public deleteFormulaColumn() {
    // this.formulaColumns = [];
  }

  public addToFormula(item: string) {
    let lastItem = this.formulas[this.formulaIndex].formulaColumns[this.formulas[this.formulaIndex].formulaColumns.length - 1]
    if (item === lastItem) {
      this.toasterService.error('Please select a different column/function');
      return;
    }
    if(!this.isReplace)
      this.formulas[this.formulaIndex].formulaColumns.push(item);
    else
      this.formulas[this.formulaIndex].formulaColumns.splice(this.formulaColIndex, 0, item);
    this.isReplace = false;
  }

  public addCalculatedColumn() {
    this.isCollapsed = false;

    // let calculated_column_name = this.columnNames.split(',').map(col => col.trim());
    let calculated_column_name = []; 
    // calculated_column_name.push(...this.columnNames['col']);
    this.columnNames.forEach(element => {
      calculated_column_name.push(element['col']);
    });
    // let formula = this.formulaColumns.join(' ').split(',').map(f => f.trim());
    let formula = [];
    this.formulas.forEach(element => {
      formula.push(element['formulaColumns'].join(' ').split(',').map(f => f.trim())[0]);
    });
    let parent_table = Array.isArray(this.table['mapped_table_name']) ? this.table['mapped_table_name'][0] : this.table['mapped_table_name'];
    let custom_table_id = this.table['custom_table_id'] || '';

    let data = {
      sl_id: this.semanticId,
      parent_table,
      custom_table_name: this.tableName.trim(),
      calculated_column_name,
      formula,
      custom_table_id
    }

    if (!this.validateColumnData(data)) return;

    this.save.emit(data);
  }

  public validateColumnData(data: any) {
    if (!this.tableName || !this.columnNames[0].col || !(this.formulas.length == this.columnNames.length)) {
      this.toasterService.error('Table name, column name and formula are mandatory fields');
      return false;
    }
    else if (data['custom_table_name'] ){
      let tableName = Array.isArray(this.table['mapped_table_name']) ? this.table['mapped_table_name'][0] : this.table['mapped_table_name'];
      if(data['custom_table_name'].toUpperCase() === tableName.toUpperCase()) {
        this.toasterService.error('Table name cannot be same as current table name');
        return false;
      }

    }
    else if (data['calculated_column_name'].length !== data['formula'].length) {
      this.toasterService.error('Please enter formula for all the columns');
      return false;
    }
    else if (data['calculated_column_name'].length) {
      let isExistingCol = data['calculated_column_name'].some(col => this.isColumn(col));

      if (isExistingCol) {
        this.toasterService.error('Column name cannot be an existing column name');
        return false;
      }
    }
    return true;
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public reset() {
    this.columns = this.table && this.table['mapped_column_name'];
    this.selectedColumns = [];
    this.columnNames = [{'col': ''}];
    this.tableName = this.allowMultiColumn ? this.table['custom_table_name'] : '';
    this.selected = '';
    this.category = 'mathematical';
    this.isCollapsed = false;
    this.formulas = [{
      'formulaColumns': [],
      'disabled': true
    }];
    this.customInput= '';
    this.selectedCustomInput = [];
    this.formulaColIndex = 0;
    this.isReplace= false;
  }

  /**
   * addColumn
   */
  public add(type) { 
    if(type == 'column')
      this.columnNames.push({'col':''});
    else if(type == 'formula'){
      this.formulaIndex = this.formulas.length;
      this.formulas.forEach(element => {
        element.disabled = false;
      });
      this.formulas.push({'formulaColumns': [],'disabled': true});
      this.isReplace= false;
    }
    else{
      this.selectedCustomInput.push(this.customInput);
      this.customInput = '';
    }
  }

  /**
   * deleteFormula
   */
  public deleteFormula(col,i,j) {
    this.formulaColIndex == this.formulas[i].formulaColumns.length 
    this.formulas[i].formulaColumns.splice(j,1);
  }


  /**
   * deleteSelectedCustomInput
   */
  public deleteSelectedCustomInput(index) {
    this.selectedCustomInput.splice(index, 1)
  }

  public replaceFormula(data, i, j){
    this.formulaColIndex = j;
    this.isReplace = true;
    this.formulas[i].formulaColumns.splice(j,1);
  }

  /**
   * deleteCol
   */
  public deleteCol(index) {
    this.columnNames.splice(index,1);
  }

  /**
   * deleteFormula
   */
  public deleteFormulaSec(i) {
    this.formulas.splice(i,1);
  }

  /**
   * editFormulaSec
   */
  public editFormulaSec(i) {
    this.isReplace= false;
    this.formulaIndex = i;
    this.formulas.forEach(element => {
      element.disabled = false;
    });
    this.formulas[i].disabled = true;
  }
}