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

  public isDisabled: boolean = true;
  public model: any;

  constructor() { }

  ngOnInit() { }

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

  public filterList(searchText) {
    let results = [];
    if (searchText) {
      results = this.tables.filter(table => {
        if ((table['mapped_table_name'] && table['mapped_table_name'].toLowerCase().match(searchText.toLowerCase())) ||
          (table['table_name'] && table['table_name'].toLowerCase().match(searchText.toLowerCase()))) {
          return table;
        }
      });
    } else {
      // TODO: original tables list
      results = this.tables;
    }

    this.tables = results;
  }
}