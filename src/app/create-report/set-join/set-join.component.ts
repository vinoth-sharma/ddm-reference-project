import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { SharedDataService } from '../shared-data.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-set-join',
  templateUrl: './set-join.component.html',
  styleUrls: ['./set-join.component.css']
})

export class SetJoinComponent implements OnInit {

  @Input() tables = [];
  @Output() public onUpdate = new EventEmitter();

  public operations = ['=', '!='];
  public operators = ['AND', 'OR'];
  public keys = [];

  table1: any;
  table2: any;

  constructor(private sharedDataService: SharedDataService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.resetKeys();
  }

  ngOnChanges() {
    this.updateKeys();
  }

  addRow() {
    this.keys.push({
      primaryKey: '',
      operation: '',
      foreignKey: ''
    });
  }

  setKeys() {
    let selectedTables = this.sharedDataService.getSelectedTables();
    let selected = selectedTables[selectedTables.length - 1];

    // checks if atleast one primaryKey and foreignKey has been set
    if (this.keys.length) {
      if (this.keys[0].primaryKey && this.keys[0].operation && this.keys[0].foreignKey) {
        selected.keys = JSON.parse(JSON.stringify(this.keys));
        this.sharedDataService.setSelectedTables(selectedTables);
        this.onUpdate.emit();
        this.resetKeys();
        return;
      }
    }

    this.toasterService.error('Primary key and foreign key are not set');
  }

  updateKeys() {
    this.table1 = this.tables[0];
    this.table2 = this.tables[1];
  }

  validateKeySelection(index: number) {
    let currentKey = this.keys[index];

    if (currentKey.primaryKey && currentKey.foreignKey &&
      currentKey.primaryKey['data_type'] !== currentKey.foreignKey['data_type']) {
      this.toasterService.error('Primary key and foreign key cannot be of different data types');
      return;
    }
  }

  deleteRow(index: number) {
    this.keys.splice(index, 1);
  }

  resetKeys() {
    Utils.closeModals();
    this.keys = [];
    this.addRow();
  }

}