import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { CalculatedColumnService } from "./calculated-column.service";
import Utils from "../../utils";

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css'],
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};

  public columns: any = [];
  public selectedColumns: any = [];
  public formulaColumns: any = [];
  public columnName: string;
  public tableName: string;
  public selected: string;
  public category: string;
  public isCollapsed: boolean;
  public semanticId: number;

  public functionsList = {
    // 'conversion': [],
    'string': ['concat', 'replace', 'slice', 'search', 'uppercase', 'lowercase', 'trim'],
    'date': ['getDate', 'getMonth', 'getFullYear', 'getTime', 'getDay', 'Date.now'],
    'mathematical': ['+', 'x', '/', '%', 'Like', 'countif', 'Not Like', 'Decode', 'Trim'],
    // 'miscellaneous': []
  }

  constructor(private activatedRoute: ActivatedRoute, private toasterService: ToastrService, private calculatedColumnService: CalculatedColumnService) {
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];
  }

  ngOnInit() { }

  ngOnChanges() {
    this.reset();
  }

  public onSelect(selected: string) {
    if (selected) {
      if (this.isValidSelection(selected)) {
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

  public isValidSelection(selected: string) {
    return this.columns.includes(selected);
  }

  public deleteSelectedColumn(index: number) {
    // get the selected item
    let selected = this.selectedColumns.splice(index, 1);

    if (this.formulaColumns.includes(selected[0])) {
      this.deleteFormulaColumn();
    }
  }

  public deleteFormulaColumn() {
    this.formulaColumns = [];
  }

  public addToFormula(item: string) {
    if (this.validateFormula(item)) {
      this.formulaColumns.push(item);
    };
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public validateFormula(item: string) {
    let functionList = this.functionsList[this.category]
    let lastItem = this.formulaColumns[this.formulaColumns.length - 1];

    // if selected item is a column and last item in formula is also a column name
    if (this.selectedColumns.includes(item) && this.selectedColumns.includes(lastItem)) {
      this.toasterService.error('Please select a function');
      return false;
    }
    // TODO: end/beginning of formula should not be operation
    // if selected item is a function and last item in formula is also a function
    else if (functionList.includes(item) && (!this.formulaColumns.length || functionList.includes(lastItem))) {
      this.toasterService.error('Please select a column');
      return false;
    }
    return true;
  }

  public addCalculatedColumn() {
    let columns = this.formulaColumns.filter(item => this.selectedColumns.includes(item));
    let data = {
      custom_table_name: this.tableName,
      parent_table: this.table['mapped_table_name'],
      calculated_column_name: this.columnName,
      sl_id: this.semanticId,
      mapped_column_name: columns,
      formula: this.formulaColumns.join(' ')
    }

    if (this.validateColumnData(data)) {
      Utils.showSpinner();
      this.calculatedColumnService.addColumn(data).subscribe(response => {
        this.toasterService.success(response['detail']);
        Utils.hideSpinner();
        this.reset();
      }, error => {
        this.toasterService.error(error.message['error']);
        Utils.hideSpinner();
        this.reset();
      });
    }
  }

  public validateColumnData(data: any) {
    // TODO: validate formula before API call
    if (!this.tableName) {
      this.toasterService.error('Table name is required');
      return false;
    }
    else if (!this.columnName) {
      this.toasterService.error('Column name is required');
      return false;
    }
    else if (data['custom_table_name'] && data['custom_table_name'] === this.table.mapped_table_name) {
      this.toasterService.error('Table name cannot be same as current table name');
      return false;
    }
    else if (data['calculated_column_name'] && this.columns.includes(data['calculated_column_name'])) {
      this.toasterService.error('Column name cannot be an existing column name');
      return false;
    }
    else if (!this.formulaColumns.length) {
      this.toasterService.error('Please enter a formula for the calculated column');
      return false;
    }
    return true;
  }

  public reset() {
    Utils.closeModals();
    this.columns = this.table && this.table['mapped_column_name'];
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnName = '';
    this.tableName = '';
    this.selected = '';
    this.category = 'mathematical';
    this.isCollapsed = false;
  }

}