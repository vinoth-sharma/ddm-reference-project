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
  selectedTables = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.cachedTables = this.tables.slice();
    console.log("this.tables visibilty : ",this.tables);
    
    // if(this.tables){
    //   if(this.tables[0] && this.tables[0].hasOwnProperty('custom_table_name')){
    //     let visibleCustomTables = this.tables.filter(i=>i.view_to_admins)
    //     this.cachedTables = visibleCustomTables.slice();
    //     // console.log("custom tables",this.cachedTables)
    //   }
    //   else{
    //     // add the true ivsible ucom tables
    //     this.cachedTables = this.tables.slice();
    //   }
    // }
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

    // set selectedTables 
    this.selectedTables = this.tables.filter(table => table.checked);
    
    // disable the action, if no tables are selected
    this.isDisabled = !this.selectedTables.length;

    // select all, if tables and selectedTables are of same length 
    this.isAllSelected = (this.tables.length === this.selectedTables.length);
  }

  public getSelection() {
    this.setSelection.emit(this.selectedTables);
  }

  public filterList(searchText: string) {
    this.tables = this.cachedTables;
   
    if (searchText) {
      this.tables = this.tables.filter(table => {
        if ((table['mapped_table_name'] && (table['mapped_table_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1) ||
          (table['table_name'] && (table['table_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1)) {
          return table;
        }
      });
    }
  }
}