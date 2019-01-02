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

  public onSelect(table: any, selectAll: boolean = false) {
    if (!table) {
      this.tables = this.tables.map(table => {
        table.checked = selectAll;
        return table;
      });
    }
    else if (table) {
      table.checked = !table.checked;
    }

    this.isDisabled = !this.hasSelected();
    this.isAllSelected = this.hasAllSelected();
  }

  public getSelection() {
    let selectedTables = this.tables.filter(table => table.checked);
    this.setSelection.emit(selectedTables);
  }

  public hasSelected() {
    return this.tables.some(table => table.checked);
  }

  public hasAllSelected() {
    return this.tables.every(table => table.checked);
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