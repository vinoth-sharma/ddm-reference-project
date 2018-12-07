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
  @Output() public getSelection = new EventEmitter();  

  constructor() { }

  ngOnInit() { }
  
  public onChange(table) {
    table.checked = !table.checked;
  }

  public onClick() {
    let selectedTables = this.tables.filter(table => table.checked)
                                    .map(table => table['sl_tables_id']);
    this.getSelection.emit(selectedTables);
  }
}
