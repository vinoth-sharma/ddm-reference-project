import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import Utils from "../../../utils";
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
  @Input() values: any[];
  @Input() count: number;
  @Input() columnName: string;
  selectValue: boolean;
  isDuplicate: boolean = false;
  saveName: string;
  semanticId : number;
  @Input() tableId: number;
  createdLov: any[];
  defaultError = "There seems to be an error. Please try again later.";

  constructor( private toasterService: ToastrService, 
    private listOfValuesService: ListOfValuesService, 
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
    this.originalData = JSON.parse(JSON.stringify(this.values));
    console.log("id",this.tableId);    
    if (this.tableId && this.columnName) {
      this.getLovList();
    }    
  }

  public getLovList() {
      // this.Loading = true;
      let options = {};
      options["tableId"] = this.tableId;
      options['columnName'] = this.columnName;
      this.listOfValuesService.getLov(options).subscribe(res => {
        this.createdLov = res['data'];     
        console.log(this.createdLov,"this.createdLov");         
        // this.Loading = false;
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
    console.log(this.values, "selectall data");
    let state = event.target.checked;
    this.values.forEach(function (item: any) {
      item.checked = state;
    })
    this.values.forEach(obj => {
      if (obj['checked'] === true) {
        this.selectedValues.push(Object.values(obj)[0]); 
      } else {
        this.selectedValues = [];
      } 
    })      
  }

  public requiredFields() {
    return !(this.selectedValues.length && this.saveName && !this.isSaveName());
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
      options['table_id'] = this.tableId;
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
        })
      err => {
        this.toasterService.error(err.message || this.defaultError);
      }
    };
  
  public isAllChecked() {
    this.selectValue = this.values.every((data) => data.checked === true);
    console.log(this.values);
  }
  
  public filterList(searchText: string) {
    this.values = this.originalData;
    if (searchText) {
      this.values = this.originalData.filter(value => {               
        let item = Object.values(value)[0];
        if ((item && item.toString().toLowerCase().match(searchText.toLowerCase()))) {
          return item;
        }
      })
    }
  };
}
