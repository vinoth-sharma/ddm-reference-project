import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css']
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};

  public columns: any =[];
  public selectedColumns: any = [];
  public formulaColumns: any = [];
  public columnName: string;
  public selected: string;
  public category: string;

  public functionsList = {
    // 'conversion': [],
    'string': ['concat', 'replace', 'slice', 'search', 'uppercase', 'lowercase', 'trim'],
    'date': ['getDate', 'getMonth', 'getFullYear', 'getTime', 'getDay', 'Date.now'],
    'mathematical': ['+', 'x', '/', '%', 'Like', 'countif', 'Not Like', 'Decode', 'Trim'],
    // 'miscellaneous': []
  }

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.reset();
  }

  public onSelect(selected: string) {
    if (selected) {
      if (this.validateSelection(selected) && !this.selectedColumns.includes(selected)) {
        this.selectedColumns.push(selected);
      }
    }
    this.selected = '';
  }

  public validateSelection(selected: string) {    
    return this.columns.includes(selected);
  }

  public deleteSelectedColumn(index: number) {
    this.selectedColumns.splice(index, 1);
    // TODO: delete from formulaCols
  }

  public deleteFormulaColumn(index: number) {
    this.formulaColumns.splice(index, 1);
  }

  public addToFormula(item: string) {
    this.formulaColumns.push(item);
  }

  public reset() {
    this.columns = this.table && this.table['mapped_column_name'];
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnName = '';
    this.selected = '';
    this.category = 'mathematical';
  }

}