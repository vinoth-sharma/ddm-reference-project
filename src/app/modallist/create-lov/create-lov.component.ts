import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
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
  originalData = [];
  @Input() data;
  @Input() type: string;
  @Input() createdLov;
  @Input() editingData;
  @Input() editDataForm;
  @Input() columnName: string;
  @Input() tableId: number;
  selectValue: boolean;
  isDuplicate: boolean = false;
  saveName: string;
  savedName:string;
  semanticId : number;
  @Output() public create = new EventEmitter();
  @Output() public edit = new EventEmitter();
  defaultError = "There seems to be an error. Please try again later.";

  constructor( private toasterService: ToastrService, 
    private listOfValuesService: ListOfValuesService, 
    private dialogRef: MatDialogRef<CreateLovComponent>,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private router: Router) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getName.subscribe((semanticName) => {
      this.getSemanticName();
    });
    this.isAllCheckedEdit();
  }

  getSemanticName() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  ngOnChanges() {
    // this.originalData = JSON.parse(JSON.stringify(this.data));
    this.originalData = this.data.slice();
    console.log("original", this.originalData, this.data);  
    console.log("edit data",this.editingData);
    // if (this.data['tableSelectedId'] && this.data['columnName']) {    //pls revisit
    //   this.getLovList();
    // }    
  }

  public getLovList() {
      // this.Loading = true;
      let options = {};
      options["tableId"] = this.data['tableSelectedId'];
      options['columnName'] = this.data['columnName'];
      this.listOfValuesService.getLov(options).subscribe(res => {
        this.createdLov = res['data'];     
        console.log(this.createdLov,"this.createdLov");         
        // this.Loading = false;
      })
  }

  public isAllCheckedEdit() {
    this.selectValue = this.editDataForm.every((data) => data.checked === true);
    // console.log(this.values);
  }

  onSelectEdit(event) {
    if (event.target.checked === true) {
      this.selectedValues.push(event.target.value)
    } else {
      this.selectedValues.splice(this.selectedValues.indexOf(event.target.value), 1);
    }
    console.log(this.selectedValues, "selected from edit");
    this.isAllCheckedEdit();
  }

  public selectAllEdit(event) {
    let state = event.target.checked;
    this.editDataForm.forEach(function (item: any) {
      item.checked = state;
    })
    this.editDataForm.forEach(obj => {
      if (obj['checked'] === true) {
        this.selectedValues.push(obj['value']); 
      } else {
        this.selectedValues = [];
      } 
    })      
  }

  onSelect(event) {
    if (event.target.checked === true) {
      this.selectedValues.push(event.target.value)
    } else {
      this.selectedValues.splice(this.selectedValues.indexOf(event.target.value), 1);
    }
    console.log(this.selectedValues, "this.selectedValues");
    this.isAllChecked();
  }

  public resetAll() {
    this.selectedValues = [];
    this.saveName = '';
  }

  public selectAll(event) {
    console.log(this.data['values'], "selectall data");
    let state = event.target.checked;
    this.data.forEach(function (item: any) {
      item.checked = state;
    })
    this.data.forEach(obj => {
      if (obj['checked'] === true) {
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
    // return !(this.selectedValues.length && this.saveName && !this.isSaveName());
  }

  isSaveName() { 
    // const matchedUser = this.createdLov.find(item => item.lov_name.toLowerCase().includes(this.saveName.toLowerCase()));
    // if (!matchedUser) {
    // this.isDuplicate == true
    // } else {
    // this.isDuplicate == false  
    // }
    if(this.createdLov.find(item => item.lov_name.toLowerCase().includes(this.saveName.toLowerCase()))) {
      // this.isDuplicate == true;
      return true;
    } else {
      // this.isDuplicate == false;
      return false;
    }
  }

  createLov() {
      let options = {};
      Utils.showSpinner();
      options['sl_id'] = this.semanticId;
      options['table_id'] =  this.tableId;
      options['lov_name'] = this.saveName;
      options['column_name'] = this.columnName;
      options['value_list'] = this.selectedValues;
      console.log("option parameters", options);      
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
      }      
    };
  
  public isAllChecked() {
    this.selectValue = this.data.every((data) => data.checked === true);
    // console.log(this.values);
  }

  onNoClick() {
    this.dialogRef.close();
    this.resetAll();
  }

  editLov(options) {  
    console.log("edit",options);    
    let object = {};  
    object["lov_id"] = options.lov_id,
    object["sl_id"] = this.semanticId,
    object["table_id"] =  this.tableId,
    object["lov_name"] = this.editingData.lov_name, 
    object["column_name"] = this.columnName,
    object["value_list"] = options.value_list
    Utils.showSpinner();
    this.listOfValuesService.updateLov(options).subscribe(
      res => {
        this.toasterService.success("LOV edited successfully")
  //       this.fetchSignatures().then((result) => {
  //         // this.selectSign = null;
  //         this.editorData = options.html;
  //         if (this.editorData.includes('<img src=')) {
  //           this.imageId = options.imageId;
  //         } else {
  //           this.imageId = null;
  //         }             
          Utils.hideSpinner();
          this.edit.emit("edited");
  //         $('#signature').modal('hide');
  //       }).catch(err => {
  //         this.toasterService.error(err.message || this.defaultError);
  //         Utils.hideSpinner();
  //       })
  //     }, error => {
  //       Utils.hideSpinner();
  //       $('#signature').modal('hide');
      })
  };
  
  public filterList(searchText: string) {
    this.data = this.originalData;
    if (searchText) {
      this.data = this.originalData.filter(value => {               
        let item = Object.values(value)[0];
        if ((item && item.toString().toLowerCase().match(searchText.toLowerCase()))) {
          return item;
        }
      })
    }
  };
}
