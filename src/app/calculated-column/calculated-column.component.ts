import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css']
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};

  public selectedColumns: any = [];
  public formulaColumns: any = [];
  public columnName: string;
  public selected: string;

  public functions = {
    'mathematical': ['+', 'x', '/', '%', 'Like', 'COUNTIF', 'NOT LIKE', 'DECODE', 'TRIM']
  }

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnName = '';
    this.selected = '';
  }

  public onSelect(selected: string) {
    if (selected && !this.selectedColumns.includes(selected)) {
      this.selectedColumns.push(selected);
    }
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

}