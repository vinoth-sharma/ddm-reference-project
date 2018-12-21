import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tables-selection-modal',
  templateUrl: './tables-selection-modal.component.html',
  styleUrls: ['./tables-selection-modal.component.css']
})

export class TablesSelectionModalComponent implements OnInit {

  @Input() tables: any[];
  @Input() isLoading: boolean;
  @Input() action: string;
  @Output() public setSelection = new EventEmitter();

  isDisabled: boolean;
  isAllSelected: boolean;
  cachedTables = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.cachedTables = this.tables.slice();
    this.isDisabled = true;
    this.isAllSelected = false;
  }

  public onChange(table) {
    table.checked = !table.checked;
    this.isDisabled = !this.hasSelected();
  }

  public getSelection() {
    let selectedTables = this.tables.filter(table => table.checked);
    this.setSelection.emit(selectedTables);
  }

  public hasSelected() {
    return this.tables.some(table => table.checked);
  }

  public selectAll(selected: boolean) {
    this.isAllSelected = selected;
    
    this.tables = this.tables.map(table => {
      table.checked = selected;
      return table;
    });
    
    this.isDisabled = !this.hasSelected();
  }

  public filterList(searchText: string) {
    this.tables = this.cachedTables;
    if (searchText) {
      this.tables = this.tables.filter(table => {
        if ((table['mapped_table_name'] && table['mapped_table_name'].toLowerCase().match(searchText.toLowerCase())) ||
          (table['table_name'] && table['table_name'].toLowerCase().match(searchText.toLowerCase()))) {
          return table;
        }
      });
    }
  }
}