import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import Utils from "../../../utils";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { ListOfValuesService } from '../list-of-values.service';
import { ObjectExplorerSidebarService } from 'src/app/shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';

@Component({
  selector: 'app-create-lov',
  templateUrl: './create-lov.component.html',
  styleUrls: ['./create-lov.component.css']
})
export class CreateLovComponent implements OnInit {

  selectedValues = [];
  editedValues = [];
  originalData = [];
  originalEditData = [];
  @Input() dataValue: any;
  @Input() type: string;
  @Input() createdLov;
  @Input() editingData: any;
  @Input() editDataForm: any;
  @Input() columnName: string;
  @Input() tableId: number;
  selectValue: boolean;
  editValue: boolean;
  isDuplicate: boolean = false;
  saveName: string;
  savedName: string;
  semanticId: number;
  @Output() public create = new EventEmitter();
  @Output() public edit = new EventEmitter();
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private toasterService: ToastrService,
    private listOfValuesService: ListOfValuesService,
    private dialogRef: MatDialogRef<CreateLovComponent>,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private router: Router) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getName.subscribe((semanticName) => {
      this.getSemanticName();
    });
  }

  getSemanticName() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  ngOnChanges() {
    this.originalData = this.dataValue ? this.dataValue.slice() : [];
    this.originalEditData = this.editDataForm ? this.editDataForm.slice() : [];
    this.editingData = this.editingData ? this.editingData : {};
    this.editedValues = this.editingData['value_list'] ? this.editingData['value_list'] : [];
    this.isAllCheckedEdit();
  }

  public getLovList() {
    let options = {};
    options["tableId"] = this.dataValue['tableSelectedId'];
    options['columnName'] = this.dataValue['columnName'];
    this.listOfValuesService.getLov(options).subscribe(res => {
      this.createdLov = res['data'];
    })
  }

  public isAllCheckedEdit() {
    this.editValue = this.editDataForm ? this.editDataForm.every((data) => data.checked === true) : false;
  }

  onSelectEdit(event) {
    if (event.target.checked === true && !this.editedValues.includes(event.target.value)) {
      this.editedValues.push(event.target.value)
    } else {
      this.editedValues.splice(this.editedValues.indexOf(event.target.value), 1);
    }
    this.isAllCheckedEdit();
    console.log("onselect edit", this.editedValues);
  }

  public selectAllEdit(event) {
    let state = event.target.checked;
    this.editDataForm.forEach(function (item: any) {
      item.checked = state;
    })
    this.editDataForm.forEach(obj => {
      if (obj['checked']) {
        if (!this.editedValues.includes(obj['value'])) {
          this.editedValues.push(obj['value']);
        }
      } else {
        this.editedValues = [];
      }
    })
    console.log("selectAll edit", this.editedValues);
  }

  onSelect(event) {
    if (event.target.checked === true) {
      this.selectedValues.push(event.target.value)
    } else {
      this.selectedValues.splice(this.selectedValues.indexOf(event.target.value), 1);
    }
    this.isAllChecked();
  }

  public resetAll() {
    this.selectedValues = [];
    this.saveName = '';
    this.dataValue = [];
  }

  public selectAll(event) {
    let state = event.target.checked;
    this.dataValue.forEach(function (item: any) {
      item.checked = state;
    })
    this.dataValue.forEach(obj => {
      if (obj['checked']) {
        this.selectedValues.push(Object.values(obj)[0]);
      } else {
        this.selectedValues = [];
      }
    })
  }

  public requiredCreateFields() {
    return !(this.selectedValues.length && this.saveName && !this.isSaveName());
  }

  public requiredEditFields() {
    return !(this.editedValues.length && this.editingData['lov_name']);
  }

  isSaveName() {
    if (this.createdLov.find(item => item.lov_name.toLowerCase().includes(this.saveName.toLowerCase()))) {
      return true;
    } else {
      return false;
    }
  }

  isEditName() {
    if (this.createdLov.find(item => item.lov_name.toLowerCase().includes(name).toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  createLov() {
    let options = {};
    Utils.showSpinner();
    options['sl_id'] = this.semanticId;
    options['table_id'] = this.tableId;
    options['lov_name'] = this.saveName;
    options['column_name'] = this.columnName;
    options['value_list'] = this.selectedValues;
    this.listOfValuesService.createListOfValues(options).subscribe(
      res => {
        this.toasterService.success("LOV created successfully")
        this.resetAll();
        Utils.hideSpinner();
        Utils.closeModals();
        this.create.emit("created");
        this.resetAll();
      })
    err => {
      this.toasterService.error(err.message || this.defaultError);
      Utils.hideSpinner();
    }
  };

  public isAllChecked() {
    this.selectValue = this.dataValue.every((data) => data.checked === true);
  }

  onNoClick() {
    this.dialogRef.close();
    this.resetAll();
  }

  editLov() {
    // this.selectedValues = [];

    // this.selectedValues = this.editingData['value_list'];
    // this.editDataForm.forEach(obj => {
    //   if (obj['checked']) {
    //     if (!this.selectedValues.includes(obj['value'])) {
    //       this.selectedValues.push(obj['value']);
    //     }
    //   } else {
    //     this.selectedValues.splice(this.selectedValues.indexOf(obj['value']), 1);
    //   }
    // })

    this.editDataForm.forEach(obj => {
      if (obj['checked'] && !this.editedValues.includes(obj['value'])) {
        this.editedValues.push(obj['value']);
      }
    })
    let object = {};
    object["lov_id"] = this.editingData['lov_id'],
      object["sl_id"] = this.semanticId,
      object["table_id"] = this.editingData['table_id'],
      object["lov_name"] = this.editingData['lov_name'],
      object["column_name"] = this.editingData['column_name'],
      object["value_list"] = this.editedValues
    Utils.showSpinner();
    this.listOfValuesService.updateLov(object).subscribe(
      res => {
        this.toasterService.success("LOV edited successfully")
        Utils.hideSpinner();
        this.edit.emit("edited");
        this.editDataForm = [];
      }, error => {
        Utils.hideSpinner();
      })
  };

  public filterList(searchText: string) {
    this.dataValue = this.originalData;
    if (searchText) {
      this.dataValue = this.originalData.filter(value => {
        let item = Object.values(value)[0];
        if ((item && item.toString().toLowerCase().match(searchText.toLowerCase()))) {
          return item;
        }
      })
    }
  };

  public filterListEdit(searchText: string) {
    this.editDataForm = this.originalEditData;
    if (searchText) {
      this.editDataForm = this.originalEditData.filter(obj => {
        let item = obj.value;
        if ((item && item.toString().toLowerCase().match(searchText.toLowerCase()))) {
          return item;
        }
      })
    }
  };
}
