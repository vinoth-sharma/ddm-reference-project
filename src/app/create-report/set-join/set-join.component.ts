import { Component, OnInit, Input } from '@angular/core';

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

  table1 = {};
  table2 = {};

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.addRow();
  }

  ngOnChanges() {
    this.setJoinData();
  }

  addRow() {
    this.keys.push({});
  }

  setJoinData() {
    // TODO: get cols eith data type 

    if (this.tables.length === 2) {
      this.table1 = this.tables[0];
      this.table2 = this.tables[1];
      return;
    }

    if (this.tables.length > 2) {
      this.table2 = this.tables[this.tables.length - 1];
      this.table1['joinCols'] = [];
      for (let i = this.tables.length - 2; i >= 0; i--) {
        // TODO: check for duplicates
        if (this.tables[i].columns.length) {
          this.table1['joinCols'].push(...this.tables[i].columns);
        }        
      }
      return;
    }

  }

  deleteRow(index: number) {
    this.keys.splice(index, 1);
    if (!this.keys.length) this.addRow();
  }

}
