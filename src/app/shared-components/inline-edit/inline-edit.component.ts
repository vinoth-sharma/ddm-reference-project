import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css']
})

export class InlineEditComponent implements OnInit {

  @Input() item: any;
  @Input() itemID: any;
  @Input() customClass: string = '';

  @Output() public onSave = new EventEmitter();

  isReadOnly = true;

  ngOnInit() { 
  }

  onDblClick() {
    this.isReadOnly = !this.isReadOnly;
  }

  onBlur() {
    this.isReadOnly = true;
  }

  onKeyDown(item, tableID, tableName) {
    this.onSave.emit({ old_val: item, table_id: tableID, table_name: tableName });
    this.isReadOnly = true;
  }
}
