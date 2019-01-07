import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";

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
  public selected: string;
  public category: string;
  public isCollapsed: boolean;

  public functionsList = {
    // 'conversion': [],
    'string': ['concat', 'replace', 'slice', 'search', 'uppercase', 'lowercase', 'trim'],
    'date': ['getDate', 'getMonth', 'getFullYear', 'getTime', 'getDay', 'Date.now'],
    'mathematical': ['+', 'x', '/', '%', 'Like', 'countif', 'Not Like', 'Decode', 'Trim'],
    // 'miscellaneous': []
  }

  constructor(private toasterService: ToastrService) { }

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
    this.selectedColumns.splice(index, 1);

    // TODO: only if del item is in formulaCols
    this.deleteFormulaColumn();
  }

  public deleteFormulaColumn() {
    // this.formulaColumns.splice(index, 1);
    this.formulaColumns = [];
  }

  public addToFormula(item: string) {
    let functionList = this.functionsList[this.category]
    let lastItem = this.formulaColumns[this.formulaColumns.length - 1];

    // if selected item is a column name and last item in formula is also a column name
    if (this.selectedColumns.includes(item) && this.selectedColumns.includes(lastItem)) {
      this.toasterService.error('Please select a function');
    }
    // if selected item is a function and last item in formula is also a function
    else if (functionList.includes(item) && functionList.includes(lastItem)) {
      this.toasterService.error('Please select a column');
    }
    else {
      this.formulaColumns.push(item);
    }
  }

  public reset() {
    this.columns = this.table && this.table['mapped_column_name'];
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnName = '';
    this.selected = '';
    this.category = 'mathematical';
    this.isCollapsed = false;
  }

}