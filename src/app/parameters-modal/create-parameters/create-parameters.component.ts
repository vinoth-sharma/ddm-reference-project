import { Component, OnInit, Inject, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ParametersService } from "../parameters.service";

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().indexOf(filterValue) != -1);
};

@Component({
  selector: 'app-create-parameters',
  templateUrl: './create-parameters.component.html',
  styleUrls: ['./create-parameters.component.css']
})
export class CreateParametersComponent implements OnInit {

  @Input() data: any;
  @Input() isEdit: boolean;
  @Input() editData: any;
  @Output() editDone = new EventEmitter();

  constructor(private dialogRef: MatDialogRef<CreateParametersComponent>,
    private _formBuilder: FormBuilder,
    private parameterService: ParametersService) { }

  parameterName = new FormControl('', [Validators.required])
  parameterValue = new FormControl('', [Validators.required])

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  validForm: boolean = false;
  loadingFlag: boolean = false;

  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<any>;
  itemsValuesGroup = [];

  filteredColumns: Observable<any>;
  columnUsedMasterData = [];
  columnControl = new FormControl();

  obj = {
    tableData: {
      group: '',
      name: '',
      id: null
    },
    columnUsedMasterData: [],
    columnUsed: '',
    parameterName: '',
    desc: '',
    parameterValues: []
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.data);
    // console.log(this.editData);
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          //  console.log(this._filterGroup(value));
          return this._filterGroup(value)

        })
      );

    this.filteredColumns = this.columnControl.valueChanges
      .pipe(
        startWith(''),
        map(column => column ? this._filterColumn(column) : this.columnUsedMasterData.slice())
      )
    // if (this.data.customTable.length > 0)
    //   this.itemsValuesGroup.push({
    //     groupName: 'Custom Tables',
    //     names: [...this.data.customTable.map(ele => ele.custom_table_name)]
    //   })

    if (this.data.tableData.length > 0)
      this.itemsValuesGroup.push({
        groupName: 'Tables',
        names: [...this.data.tableData.map(ele => ele.mapped_table_name)]
      })

    if (this.isEdit)
      this.setDefaultValues();
    // console.log(this.obj);
  }

  setDefaultValues() {
    this.obj.parameterName = this.editData.parameter_name;
    this.obj.columnUsed = this.editData.column_used;
    this.obj.desc = this.editData.description;
    this.obj.parameterValues = this.editData.parameter_formula;
    this.obj.tableData.id = this.editData.is_custom ? this.editData.custom_table_id : this.editData.sl_tables_id;
    this.obj.tableData.group = this.editData.is_custom ? 'Custom Tables' : 'Tables';

    if (this.obj.tableData.group === 'Custom Tables') {
      this.data.customTable.forEach(element => {
        if (element.custom_table_id === this.obj.tableData.id) {
          this.obj.tableData.name = element.custom_table_name
        }
      });
    }
    else if (this.obj.tableData.group === 'Tables') {
      this.data.tableData.forEach(element => {
        if (element.sl_tables_id === this.obj.tableData.id) {
          this.obj.tableData.name = element.mapped_table_name
        }
      });
    }
  }

  onSelectionChanged(event) {
    this.obj.tableData.group = event.option.group.label;
    this.obj.tableData.name = event.option.value;
    this.obj.columnUsed = "";
    
    if (this.obj.tableData.group === 'Custom Tables') {
      this.data.customTable.forEach(element => {
        if (element.custom_table_name === this.obj.tableData.name) {
          this.columnUsedMasterData = element.mapped_column_name
          this.obj.tableData.id = element.custom_table_id
        }
      });
    }
    else if (this.obj.tableData.group === 'Tables') {
      this.data.tableData.forEach(element => {
        if (element.mapped_table_name === this.obj.tableData.name) {
          this.columnUsedMasterData = element.mapped_column_name
          this.obj.tableData.id = element.sl_tables_id
        }
      });
    }

  }

  onColumnSelected(event){
    this.obj.columnUsed =  event.option.value;
  }

  private _filterGroup(value: string) {
    // console.log(value);

    if (value) {
      return this.itemsValuesGroup
        .map(group => ({ groupName: group.groupName, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.itemsValuesGroup;
  }

  private _filterColumn(value: string) {
    const filterValue = value.toLowerCase();
    return this.columnUsedMasterData.filter(column => column.toLowerCase().indexOf(filterValue) != -1);
  }

  createParameter() {
    let req = {
      parameter_name: this.obj.parameterName,
      column_used: this.obj.columnUsed,
      parameter_formula: this.obj.parameterValues,
      description: this.obj.desc,
      is_custom: false
    }

    if (this.obj.tableData.group === 'Custom Tables') {
      req.is_custom = true;
      req['custom_table_id'] = this.obj.tableData.id;
    }
    else if (this.obj.tableData.group === 'Tables') {
      req.is_custom = false;
      req['sl_tables_id'] = this.obj.tableData.id;
    }
    this.createOrUpdateParams(req);

  }

  createOrUpdateParams(req) {
    this.loadingFlag = true;
    if (this.isEdit) {
      req['sl_parameters_id'] = this.editData.sl_parameters_id;
      this.parameterService.updateParameterForTable(req).subscribe(res => {
        // console.log(res);
        this.editDone.emit(true)
      })
    }
    else {
      this.parameterService.createParameterForTable(req).subscribe(res => {
        // console.log(res);
        this.loadingFlag = false;
      })
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    // Add our value
    if ((value || '') && !this.obj.parameterValues.some(val => val === value.trim())) {
      //when user gives numbers (1,22..) as input, we are converting it to number
      this.obj.parameterValues.push(isNaN(+value) ? value.trim() : +value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    // const index = this.fruits.indexOf(fruit);
    const i = this.obj.parameterValues.indexOf(tag);

    if (i >= 0) {
      this.obj.parameterValues.splice(i, 1);
    }
  }

  validateForm() {
    // console.log(this.obj);
    if (this.obj.parameterName != '' && this.obj.columnUsed != ''
      && this.obj.parameterValues.length > 0)
      return true
    else
      return false
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
