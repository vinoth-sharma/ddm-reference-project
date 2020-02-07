import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
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
  @Input() toSpaceValidate:boolean = false;
  itemCopy: any;
  // @Input() isReadOnly: boolean;
  @Output() public onSave = new EventEmitter();

  isReadOnly = true;

  constructor(private toastrService:ToastrService) { }

  ngOnInit() {
    if(this.toSpaceValidate)
      this.item = this.spacevalidator(this.item); 
  }

  onDblClick(){
    this.itemCopy = this.item;
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
      this.onSave.emit({ old_val: this.spaceValidatorInverse(this.itemCopy), table_id: tableID, table_name: tableName });
      // this.itemCopy = this.item;
    }
  }

  spacevalidator(str){
    return str.replace(/_dummy_/g," ")
  }

  spaceValidatorInverse(str){
    return str.replace(/ /g,'_dummy_')
  }
}
