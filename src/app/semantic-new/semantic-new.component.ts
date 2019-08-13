import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { SemanticNewService } from "./semantic-new.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import Utils from "../../utils";
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-semantic-new',
  templateUrl: './semantic-new.component.html',
  styleUrls: ['./semantic-new.component.css'],
  viewProviders: [MatExpansionPanel]
})

export class SemanticNewComponent {
  public sem: any;
  public sls: number;
  public semanticList;
  public semDetails;
  public selectedItemsNew = [];
  public selectedItemsExistingTables = [];
  public selectedItemsNonExistingTables = [];
  public inputSemanticValue: string;
  public columns = [];
  public isUpperDiv;
  public isLowerDiv;
  public semanticId: number;
  public selectedTablesExisting = [];
  public selectedTablesNonExisting = [];
  public remainingTables = [];
  public confHeader: string = "Save as";
  public confText: string = "Save Semantic Layer as:";
  public userId: string;
  public defaultError = "There seems to be an error. Please try again later.";
  public existingTables = [];
  public semanticLayers = [];
  public allSemanticLayers = [];
  public firstName: string;
  public finalName: string;
  public toasterMessage: string;
  public tablesNew = [];
  public tablesCombined = [];
  public isUpperDivDisabled: boolean = false;
  public isLowerDivDisabled: boolean = true;
  public data:any = {};
  panelOpenState = false;

  public dropDownSettingsNew = {
    singleSelection: false,
    textField: 'mapped_table_name',
    idField: 'sl_tables_id',
    selectAllText: 'Select All',
    // itemsShowLimit: 18,
    allowSearchFilter: true,
    enableCheckAll: true,
    maxHeight:160
  };

  public dropdownSettingsNonExistingTables = {
    singleSelection: false,
    idField: 'table_num',
    textField: 'table_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 15,
    allowSearchFilter: true,
    enableCheckAll: true,
    maxHeight:160
  };

  public dropdownSettingsExistingTables = {
    singleSelection: false,
    idField: 'sl_tables_id',
    textField: 'mapped_table_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 15,
    allowSearchFilter: true,
    enableCheckAll: true,
    maxHeight:160
  };

  constructor(
    private router: Router,
    private semanticNewService: SemanticNewService,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private semdetailsService: SemdetailsService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService
  ) {
    this.authenticationService.myMethod$.subscribe(res => {
      this.sem = res['sls'];
      this.getSemanticId();
    });
    this.authenticationService.Method$.subscribe(userId => this.userId = userId);
    this.semanticNewService.dataMethod$.subscribe(semanticLayers => this.semanticLayers = semanticLayers);
  }

  ngOnInit() {
    this.selectedItemsNew = [];
    this.selectedItemsExistingTables = [];
    this.selectedItemsNonExistingTables = [];
    this.getTables();
  }

  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  public fetchSemantic(event: any) {

    if (!event.target.value){ 
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
      this.columns = [];
      this.remainingTables = [];
      return;
    }

    this.sem = this.semanticLayers;
    let isValid = this.sem.map(el => el.sl_name).includes(this.inputSemanticValue);
    let semanticLayerName = event.target.value.substr(event.target.value.indexOf(' ')+1);

    if (isValid || !this.inputSemanticValue.length) {
      this.sls = this.sem.find(x => x.sl_name == semanticLayerName).sl_id;
      Utils.showSpinner();
      this.semdetailsService.fetchsem(this.sls).subscribe(res => {
        this.columns = res["data"]["sl_table"];
      });

      this.objectExplorerSidebarService.getAllTables(this.sls).subscribe(response => {
        this.remainingTables = response['data'];
      }, error => {
        this.toastrService.error(error.message || this.defaultError);
        Utils.hideSpinner();
      })
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
      Utils.hideSpinner();
    }
    else{
      Utils.showSpinner();
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
      this.remainingTables = [];
      this.columns = [];
      Utils.hideSpinner();
      this.toastrService.error("Please enter existing Semantic layer value!");
    }
  };

  public checkEmpty() {
    // checks for the required inputs  
    if (!this.inputSemanticValue && !this.selectedItemsExistingTables.length && !this.selectedItemsNonExistingTables.length) {
      this.toastrService.error("All fields need to be filled to create a Semantic layer");
    }
    else {
      // checks for duplicate values
      if (this.sem.find(ele => ele.sl_name == this.inputSemanticValue)) {
        document.getElementById("open-modal-btn").click();
      }
      else {
        this.toastrService.error("Please enter existing Semantic layer value!");
      }
    }
  }

  public saveSemantic(value: string) {
    this.finalName = value;
      // checks for duplicate values in 'Save as' modal
      if (this.sem.find(ele => ele.sl_name.toUpperCase() === value.trim().toUpperCase() || !value.trim().length)) {
        this.toastrService.error("Please enter a unique name for the Semantic layer.");
      }
      else {
        this.createSemanticLayer(this.data);
        // this.createSemanticLayer();
      }
  }

  public getTables() {
    this.authenticationService.getTables(this.semanticId).subscribe(
      response => { 
      this.existingTables = response['data']['sl_table'];
    },
      error => this.toastrService.error(error['message'])
    );
  }

  public getSemanticLayers() {
    Utils.showSpinner();
    this.authenticationService.getSldetails(this.userId).subscribe(response => {
      this.semanticLayers = response['data']['sl_list'];
      this.toastrService.success(this.toasterMessage);
      Utils.hideSpinner();
    }, error => {
      this.toastrService.error(error['message']);
    })
    this.authenticationService.fun(this.userId).subscribe(response => {
      this.semDetails = response["sls"];
      this.authenticationService.setSlMethod(this.semDetails);
    }, 
    error => {
      this.toastrService.error(error['message']);
    }
    )
    this.authenticationService.getSldetails(this.userId).subscribe((res) => {
      this.semanticList = res['data']['sl_list'];
      this.semanticNewService.dataMethod(this.semanticList);
    })
  };

  public createSemanticLayer(data?:Object) {

      if(this.firstName.length){
        // do nothing as data is already set
      }
      else{
      // this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
      data['sl_name'] = this.finalName.trim();
      data['original_table_name_list'] = this.tablesCombined;
      }

    Utils.showSpinner();
    this.semanticNewService.createSemanticLayer(data).subscribe(
      response => {
        let semanticList = {};
        this.toasterMessage = response['message'];
        this.getSemanticLayers();
        this.reset();
        Utils.closeModals();
        this.sem = this.semanticLayers;
        this.selectedTablesExisting = [];
        this.selectedTablesNonExisting = [];
      },
      error => {
        this.toastrService.error(error['message']['error']);
        this.selectedTablesExisting = [];
        this.selectedTablesNonExisting = []
        Utils.hideSpinner();
      }
    )
  };

  public onItemSelectNew(item: any) {
    this.tablesNew.push(item.mapped_table_name);
  };

  public onItemDeSelectNew(item: any) {
    let index = this.tablesNew.indexOf(item.mapped_table_name);
    this.tablesNew.splice(index, 1);
  };

  public onSelectAllNew(items: any) {
    this.tablesNew = [];
    items.forEach(element => this.tablesNew.push(element.mapped_table_name));
  }

  public onDeSelectAllNew(event?:any) {
    this.tablesNew = [];
  }

  public onItemSelectExisting(item: any) {
    this.selectedTablesExisting.push(item.mapped_table_name);
  }

  public onItemDeSelectExisting(item: any) {
    let index = this.selectedTablesExisting.indexOf(item.mapped_table_name);
    this.selectedTablesExisting.splice(index, 1);
  }

  public onSelectAllExisting(items: any) {
    this.selectedTablesExisting = [];
    items.forEach(element => this.selectedTablesExisting.push(element.mapped_table_name));
  }

  public onDeSelectAllExisting(event?:any) {
    this.selectedTablesExisting = [];
  }

  public onItemSelectNonExisting(item: any) {
    this.selectedTablesNonExisting.push(item.table_name);
  }

  public onItemDeSelectNonExisting(item: any) {
    let index = this.selectedTablesNonExisting.indexOf(item.table_name);
    this.selectedTablesNonExisting.splice(index, 1);
  }

  public onSelectAllNonExisting(items: any) {
    this.selectedTablesNonExisting = [];
    items.forEach(element => this.selectedTablesNonExisting.push(element.table_name));
  }

  public onDeSelectAllNonExisting(event?:any) {
    this.selectedTablesNonExisting = [];
  }

  public validateInputField() {
    if (!this.firstName || !this.firstName.trim() || !this.tablesNew.length) {
      this.toastrService.error('All fields need to be filled to create a Semantic layer');
      return false;
    }
    else {
      this.objectExplorerSidebarService.checkUnique().subscribe(
        res =>{ 
          // //console.log("ALL SEMANTIC LAYERS:",res)
          this.allSemanticLayers = res['existing_sl_list']
        })
      // if (this.semanticLayers.find(ele => ele.sl_name.toUpperCase() === this.firstName.trim().toUpperCase() || !this.firstName.trim().length)) {
        if (this.allSemanticLayers.find(ele => ele.toUpperCase() === this.firstName.trim().toUpperCase() || !this.firstName.trim().length)) {
        this.toastrService.error("Please enter a unique name for the Semantic layer.");
        return false;
      }
    }
    return true;
  };

  public saveProcess() {
    this.data['user_id'] = [this.userId];
    if (!this.isUpperDivDisabled && !this.isLowerDivDisabled) {
      
    }
    else if (this.isLowerDivDisabled) {
      //writing new-sem logic here
      if (!this.validateInputField()) return;
      this.data['sl_name'] = this.firstName.trim();
      this.data['original_table_name_list'] = this.tablesNew;
      this.createSemanticLayer(this.data);
    }
    else if(this.isUpperDivDisabled){
      //writing existing-sem logic here
      if(this.selectedTablesExisting.length && !this.selectedTablesNonExisting.length){
        this.tablesCombined = this.selectedTablesExisting;
      }
      else if(this.selectedTablesNonExisting.length && !this.selectedTablesExisting.length){
        this.tablesCombined = this.selectedTablesNonExisting;
      }
      else if(this.selectedTablesNonExisting.length && this.selectedTablesExisting.length){
        this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
      }
      else if(this.selectedTablesNonExisting.length == 0 && this.selectedTablesExisting.length == 0){
        // this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
        this.toastrService.error("Please select any table(s) from one of the below dropdowns");
        return;
      }
      this.data['original_table_name_list'] = this.tablesCombined;
      this.checkEmpty();
    }
    else {
      this.checkEmpty();
    }
  }

  // public saveProcess() {
  //   if (this.isLowerDivDisabled && !this.isUpperDivDisabled) {
  //     this.createSemanticLayer();
  //   }
  //   else {
  //     this.checkEmpty();
  //   }
  // }

  public disableLowerDiv() {
    this.reset();
    this.isLowerDivDisabled = true;
    this.isUpperDivDisabled = false;
  }

  public disableUpperDiv() {
    this.reset();
    this.isLowerDivDisabled = false;
    this.isUpperDivDisabled = true;
  }

  public reset() {
    if (this.isLowerDivDisabled && !this.isUpperDivDisabled) {
      this.firstName = "";
      this.selectedItemsNew = [];
    }
    else {
      this.inputSemanticValue = "";
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
    }
  }
}