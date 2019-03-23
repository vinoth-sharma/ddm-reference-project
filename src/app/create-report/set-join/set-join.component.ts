import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-set-join',
  templateUrl: './set-join.component.html',
  styleUrls: ['./set-join.component.css']
})

export class SetJoinComponent implements OnInit {

  @Input() tables = [];

  public operations = ['=', '!='];
  public operators = ['AND', 'OR'];
  public keys = [];

  table1: any; 
  table2: any;

  constructor(private sharedDataService: SharedDataService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.addRow();
  }

  ngOnChanges() {
    this.updateKeys();
  }

  addRow() {
    this.keys.push({});
  }

  setKeys() {
    let selectedTables = this.sharedDataService.getSelectedTables();
    let selected = selectedTables[selectedTables.length - 1];

    // selected.keys = this.keys;
    selected.keys = JSON.parse(JSON.stringify(this.keys));

    this.sharedDataService.setSelectedTables(selectedTables);

    // TODO: reset data
    // this.keys = [];
  }

  updateKeys() {
    if (this.tables.length === 2) {
      this.table1 = this.tables[0];
      this.table2 = this.tables[1];
      return;
    }

    // TODO: if tables.length > 2
  }

  validateKeySelection(index: number) {
    let currentKey = this.keys[index];

    //TODO: if (!currentKey.primaryKey || !currentKey.foreignKey) {
    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }
  }

  deleteRow(index: number) {
    this.keys.splice(index, 1);
  }

}  