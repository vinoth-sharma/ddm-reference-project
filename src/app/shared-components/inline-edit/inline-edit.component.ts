import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css']
})

export class InlineEditComponent implements OnInit {

  @Input() item: any;
  @Input() itemID: any;
  @Input() customClass: string = '';
  @Input() inputStyle:any;
  // @Input() isReadOnly: boolean;
  @Output() public onSave = new EventEmitter();

  isReadOnly = true;

  constructor(private toastrService:ToastrService) { }

  ngOnInit(){
    // console.log(this.inputStyle);
  }

  onDblClick(){
    this.isReadOnly = !this.isReadOnly;
  }

  onBlur(event) {
    this.isReadOnly = true;
    let oldValue = this.item;
    event.target.value = oldValue;
  }

  onKeyDown(item, tableID, tableName) {
    if(!tableName.trim()){
      this.toastrService.error('Please enter name');
      return;
    }else{
      this.onSave.emit({ old_val: item, table_id: tableID, table_name: tableName });
      // this.isReadOnly = true;
    }
  }
}
