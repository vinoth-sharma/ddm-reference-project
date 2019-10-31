import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { ListOfValuesService } from '../list-of-values.service';

@Component({
  selector: 'app-lov-container',
  templateUrl: './lov-container.component.html',
  styleUrls: ['./lov-container.component.css']
})
export class LovContainerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LovContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastrService,
    private listOfValuesService: ListOfValuesService) { }

  selected = new FormControl(0);
  enableEditing: boolean = false;
  dataInject: boolean = true;
  editingData;
  values = [];
  createdLov = [];
  load: boolean = true;
  editDataForm = [];

  ngOnInit() {
    this.values = this.data.values;
    this.getLovList();
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

  getUpdatedLov(event) {
    this.enableEditing = false;
    this.selected.setValue(0);
    this.getLovList();
  }

  public getLovList() {
    this.load = true;
    let options = {};
    options["tableId"] = this.data['tableSelectedId'];
    options['columnName'] = this.data['columnName'];
    this.listOfValuesService.getLov(options).subscribe(res => {
      this.createdLov = res['data'];
      this.load = false;
    })
  }

  enableEditingTab(data) {
    this.enableEditing = true;
    this.editingData = data;
    let editDataForm = [];
    let selectedValues = this.editingData['value_list'];
    console.log(selectedValues,"selectedValues");
    let allValues = this.values.map(item => Object.values(item)[0]);
    console.log(allValues,"allValues");
    // allValues.forEach(item => {
    //   if (selectedValues.includes(item)) {
    //     editDataForm.push({ value: item, checked: true });
    //   } else {
    //     editDataForm.push({ value: item, checked: false });
    //   }
    // })
    allValues.forEach(function(el, key) {
      editDataForm.push({ value: el, checked: true });
    });
    this.editDataForm = editDataForm;
    console.log(editDataForm,"editDataForm");
    this.selected.setValue(2);
  }
}
  