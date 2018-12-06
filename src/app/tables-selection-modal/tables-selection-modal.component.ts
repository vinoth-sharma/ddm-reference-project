import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tables-selection-modal',
  templateUrl: './tables-selection-modal.component.html',
  styleUrls: ['./tables-selection-modal.component.css']
})
export class TablesSelectionModalComponent implements OnInit {

  @Input() tables: any[];
  @Input() isLoading: boolean;

  constructor() { }

  ngOnInit() { }
  
  public onChange(table){
    table.checked = !table.checked;
  }

  public getSelectedTables(){
    return this.tables.filter(table => table.checked);  
  }
}
