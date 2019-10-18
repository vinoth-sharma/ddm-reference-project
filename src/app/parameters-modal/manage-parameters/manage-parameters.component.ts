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

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-manage-parameters',
  templateUrl: './manage-parameters.component.html',
  styleUrls: ['./manage-parameters.component.css']
})
export class ManageParametersComponent implements OnInit {

  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<any>;
  itemsValuesGroup = [];

  @Input() data: any;
  @Output() editParameter = new EventEmitter();

  tableData = {
    group: "",
    name: "",
    id: null
  }
  selectedParameterToDel = null;
  parametersList = [];
  enableDeleteConfirmationDialog: boolean = false;
  disableApplyBtn: boolean = false;
  dataLoading: boolean = false;

  constructor(private dialogRef: MatDialogRef<ManageParametersComponent>,
    private _formBuilder: FormBuilder,
    private parameterService: ParametersService) { }


  ngOnInit() {

    // console.log(this.data);

    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          //  console.log(this._filterGroup(value));
          return this._filterGroup(value)

        })
      );

    if (this.data.customTable.length > 0)
      this.itemsValuesGroup.push({
        groupName: 'Custom Tables',
        names: [...this.data.customTable.map(ele => ele.custom_table_name)]
      })

    if (this.data.tableData.length > 0)
      this.itemsValuesGroup.push({
        groupName: 'Tables',
        names: [...this.data.tableData.map(ele => ele.mapped_table_name)]
      })
  }

  emitEditParameter(data) {
    // console.log(data);
    this.editParameter.emit(data);
  }

  showConfirmationDilaog(data) {
    // console.log(data);
    this.enableDeleteConfirmationDialog = true;
    this.selectedParameterToDel = data.sl_parameters_id;
  }


  deleteParameter() {
    this.disableApplyBtn = true;
    this.parameterService.deleteParameter(this.selectedParameterToDel).subscribe(res => {
      // console.log(res);
      this.selectedParameterToDel = null;
      this.enableDeleteConfirmationDialog = false;
      this.disableApplyBtn = false;
      // this.getExistingData();
    })
  }

  onSelectionChanged(event) {
    // console.log(event);
    this.tableData.group = event.option.group.label;
    this.tableData.name = event.option.value;

    if (this.tableData.group === 'Custom Tables') {
      this.data.customTable.forEach(element => {
        if (element.custom_table_name === this.tableData.name) {
          // this.columnUsedMasterData = element.mapped_column_name
          this.tableData.id = element.custom_table_id
        }
      });
    }
    else if (this.tableData.group === 'Tables') {
      this.data.tableData.forEach(element => {
        if (element.mapped_table_name === this.tableData.name) {
          // this.columnUsedMasterData = element.mapped_column_name
          this.tableData.id = element.sl_tables_id
        }
      });
    }
    this.getAllParameters(this.tableData.id)
  }

  getAllParameters(id) {
    this.dataLoading = true;
    if (this.tableData.group === 'Custom Tables') {
      this.parameterService.getExistingParametersCustomTables(id).subscribe(res => {
        // console.log(res);
        this.parametersList = res.data;
        this.dataLoading = false;
      })
    }
    else if (this.tableData.group === 'Tables') {
      this.parameterService.getExistingParametersTables(id).subscribe(res => {
        // console.log(res);
        this.parametersList = res.data;
        this.dataLoading = false;
      })
    }
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
}
