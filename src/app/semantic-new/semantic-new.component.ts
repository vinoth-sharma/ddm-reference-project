import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { SemanticNewService } from "./semantic-new.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";


@Component({
  selector: 'app-semantic-new',
  templateUrl: './semantic-new.component.html',
  styleUrls: ['./semantic-new.component.css']
})
export class SemanticNewComponent {
  public sem: any;
  public sls: number;
  public selectedItemsNew = [];
  public selectedItemsExistingTables = [];
  public selectedItemsNonExistingTables = [];
  public inputSemanticValue: string;
  public columns = [];
  public semanticId: number;
  public remainingTables = [];
  public confHeader: string = "Save as";
  public confText: string = "Save Semantic Layer as:";
  public userId: string;
  public defaultError = "There seems to be an error. Please try again later.";
  public semanticLayerId: number;
  public existingTables = [];
  public semanticLayers = [];
  public firstName: string;
  public toasterMessage: string;
  public tablesNew = [];
  public tablesCombined = [];
  public isUpperDiv: boolean = false;
  public isLowerDiv: boolean = true;
  public finalName: string;

  public dropDownSettingsNew = {
    singleSelection: false,
    textField: 'mapped_table_name',
    enableCheckAll: false,
    idField: 'sl_tables_id',
    itemsShowLimit: 4,
    allowSearchFilter: true
  };
  public dropdownSettingsNonExistingTables = {
    singleSelection: false,
    idField: 'table_num',
    textField: 'table_name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    enableCheckAll: false
  };
  public dropdownSettingsExistingTables = {
    singleSelection: false,
    idField: 'sl_tables_id',
    textField: 'mapped_table_name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    enableCheckAll: false
  };


  constructor(private semanticNewService: SemanticNewService, private Router: Router, private AuthenticationService: AuthenticationService, private ToasterService: ToastrService, private SemdetailsService: SemdetailsService, private objectExplorerSidebarService: ObjectExplorerSidebarService) {
    this.AuthenticationService.myMethod$.subscribe((res) => {
      this.sem = res['sls'];
      this.getSemanticId();
    });
    this.AuthenticationService.Method$.subscribe(userId => this.userId = userId);
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers });
  }

  ngOnInit() {
    this.selectedItemsNew = [];
    this.selectedItemsExistingTables = [];
    this.selectedItemsNonExistingTables = [];
    this.getTables();
  }

  public getSemanticId() {
    this.Router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  public fetchSemantic(event: any) {
    if(!event.target.value){
      return;
    } 
    let isValid =  this.sem.map(el => el.sl_name).includes(this.inputSemanticValue);
    if(isValid || !this.inputSemanticValue.length){
      this.sem = this.semanticLayers;
      Utils.showSpinner();
      this.sls = this.sem.find(x => x.sl_name == event.target.value).sl_id;
      this.SemdetailsService.fetchsem(this.sls).subscribe(res => {
        this.columns = res["data"]["sl_table"];
      });

      this.objectExplorerSidebarService.getAllTables(this.sls).subscribe(response => {
        this.remainingTables = response['data'];
      }, error => {
        this.ToasterService.error(error.message || this.defaultError);
      })
      Utils.hideSpinner();
    }
  };


  public checkEmpty() {
    //Validation of all the the 3 inputs in 'Copy existing Semantic layer:' div  
    if (!this.inputSemanticValue || !this.selectedItemsExistingTables.length || !this.selectedItemsNonExistingTables.length) {
      this.ToasterService.error("All fields need to be filled to create a SL");
    }
    else {
      //To check whether 'Copy existing Semantic layer' input box is having duplicate(Existing) values only
      if (this.sem.find(ele => ele.sl_name == this.inputSemanticValue)) {
        document.getElementById("open-modal-btn").click();
      }
      else {
        this.ToasterService.error("Please enter existing SL value!");
      }
    }
  }

  public saveSemantic(value: string) {
    let pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?]/);
    this.finalName = value;
    if (pattern.test(value)) {
      this.ToasterService.error("Please do not enter Special Character(s) in the SL name!");
      // this.reset();
    }
    else {
      //To check whether 'Save as' modal input box is unique(new) values only
      if (this.sem.find(ele => ele.sl_name == value.trim() || value.trim().length == 0)) {
        this.ToasterService.error("Please enter Unique Name to the saving SL!");
      }
      else {
        this.createSemanticLayer();
      }
    }
  }

  public getTables() {
    this.AuthenticationService.getTables(this.semanticLayerId).subscribe(
      (res) => {
        this.existingTables = res['data']['sl_table'];
      },
      (error) => this.ToasterService.error[error['message']]);
  }

  public getSemanticLayers() {
    Utils.showSpinner();
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      Utils.hideSpinner();
      this.semanticLayers = res['data']['sl_list'];
      this.ToasterService.success(this.toasterMessage);
    }, (err) => {
      this.ToasterService.error(err['message'])
    })
  };

  public createSemanticLayer() {
    let data = {};
    data['user_id'] = [this.userId];
    if (this.isLowerDiv == true && this.isUpperDiv == false) {
      //calls validateInput function and checks for true or false
      if (!this.validateInputField()) return;
      data['sl_name'] = this.firstName.trim();
      data['original_table_name_list'] = this.tablesNew;
    }
    else {
      data['sl_name'] = this.finalName.trim();
      data['original_table_name_list'] = this.tablesCombined;
    }
      Utils.showSpinner();
      this.semanticNewService.createSemanticLayer(data).subscribe(
        res => {
          this.toasterMessage = res['message'];
          this.getSemanticLayers();
          this.sem = this.semanticLayers;
          this.reset();
        },
        err => {
          this.ToasterService.error(err['message'])
          Utils.hideSpinner();
        }
      )
  };

  public onItemSelectNew(item: any) {
    this.tablesNew.push(item.mapped_table_name);
    console.log(this.tablesNew);
    return this.tablesNew;
  };

  public onItemDeSelectNew(item: any) {
    let index = this.tablesNew.indexOf(item.mapped_table_name);
    this.tablesNew.splice(index, 1);
    console.log(this.tablesNew);
    return this.tablesNew;
  };

  public onItemSelectExisting(item: any) {
    this.tablesCombined.push(item.mapped_table_name);
    console.log(this.tablesCombined);
    return this.tablesCombined;
  }

  public onItemDeSelectExisting(item: any) {
    let index = this.tablesCombined.indexOf(item.mapped_table_name);
    this.tablesCombined.splice(index, 1);
    console.log(this.tablesCombined);
    return this.tablesCombined;
  }

  public onItemSelectNonExisting(item: any) {
    this.tablesCombined.push(item.table_name);
    console.log(this.tablesCombined);
    return this.tablesCombined;
  }

  public onItemDeSelectNonExisting(item: any) {
    let index = this.tablesCombined.indexOf(item.table_name);
    this.tablesCombined.splice(index, 1);
    console.log(this.tablesCombined);
    return this.tablesCombined;
  }

  validateInputField() {
    if (!this.firstName || !this.firstName.trim() || !this.tablesNew.length) {
      this.ToasterService.error('All fields need to be filled to create a SL');
      return false;
    }
    else {
      for (var i = 0; i < this.semanticLayers.length; i++) {
        if (this.semanticLayers[i].sl_name.includes(this.firstName.trim())) {
          this.ToasterService.error('This Semantic Layer name already exists');
          return false;
        }
      }
    }
    return true;
  };


  public saveProcess() {
    if (this.isLowerDiv == true && this.isUpperDiv == false ) {
      this.createSemanticLayer();
    }
    else {
      this.checkEmpty();
    }
  }

  public LowerDivDisable() {
    this.isLowerDiv = true;
    this.isUpperDiv = false;
  }

  public UpperDivDisable() {
    this.isLowerDiv = false;
    this.isUpperDiv = true;
  }

  public reset(){
    if (this.isLowerDiv == true && this.isUpperDiv == false ) {
      this.firstName = "";
      this.selectedItemsNew = [];
    }
    else{
      this.inputSemanticValue = "";
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
    }
  }
}