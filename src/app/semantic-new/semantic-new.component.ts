import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { SemanticNewService } from "./semantic-new.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import Utils from "../../utils";

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
  public selectedTablesExisting = [];
  public selectedTablesNonExisting = [];
  public remainingTables = [];
  public confHeader: string = "Save as";
  public confText: string = "Save Semantic Layer as:";
  public userId: string;
  public defaultError = "There seems to be an error. Please try again later.";
  public existingTables = [];
  public semanticLayers = [];
  public firstName: string;
  public finalName: string;
  public toasterMessage: string;
  public tablesNew = [];
  public tablesCombined = [];
  public isUpperDiv: boolean = false;
  public isLowerDiv: boolean = true;

  public dropDownSettingsNew = {
    singleSelection: false,
    textField: 'mapped_table_name',
    idField: 'sl_tables_id',
    selectAllText: 'Select All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    enableCheckAll: true
  };

  public dropdownSettingsNonExistingTables = {
    singleSelection: false,
    idField: 'table_num',
    textField: 'table_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    enableCheckAll: true
  };

  public dropdownSettingsExistingTables = {
    singleSelection: false,
    idField: 'sl_tables_id',
    textField: 'mapped_table_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    enableCheckAll: true
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
    if (!event.target.value) return;

    this.sem = this.semanticLayers;
    let isValid = this.sem.map(el => el.sl_name).includes(this.inputSemanticValue);

    if (isValid || !this.inputSemanticValue.length) {
      this.sls = this.sem.find(x => x.sl_name == event.target.value).sl_id;
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
  };

  public checkEmpty() {
    // checks for the required inputs  
    if (!this.inputSemanticValue || !this.selectedItemsExistingTables.length || !this.selectedItemsNonExistingTables.length) {
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
    let pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?@]/);
    this.finalName = value;
    if (pattern.test(value)) {
      this.toastrService.error("Please do not enter special character(s) for the Semantic layer name.");
    }
    else {
      // checks for duplicate values in 'Save as' modal
      if (this.sem.find(ele => ele.sl_name.toUpperCase() === value.trim().toUpperCase() || !value.trim().length)) {
        this.toastrService.error("Please enter a unique name for the Semantic layer.");
      }
      else {
        this.createSemanticLayer();
      }
    }
  }

  public getTables() {
    this.authenticationService.getTables(this.semanticId).subscribe(
      response => this.existingTables = response['data']['sl_table'],
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
  };

  public createSemanticLayer() {
    let data = {};
    data['user_id'] = [this.userId];

    if (this.isLowerDiv && !this.isUpperDiv) {
      if (!this.validateInputField()) return;

      data['sl_name'] = this.firstName.trim();
      data['original_table_name_list'] = this.tablesNew;
    }
    else {
      this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
      data['sl_name'] = this.finalName.trim();
      data['original_table_name_list'] = this.tablesCombined;
    }

    Utils.showSpinner();
    this.semanticNewService.createSemanticLayer(data).subscribe(
      response => {
        this.toasterMessage = response['message'];
        this.getSemanticLayers();
        this.reset();
        Utils.closeModals();
        this.sem = this.semanticLayers;
      },
      error => {
        this.toastrService.error(error['message']);
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

  public onDeSelectAllNew() {
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

  public onDeSelectAllExisting() {
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

  public onDeSelectAllNonExisting() {
    this.selectedTablesNonExisting = [];
  }

  public validateInputField() {
    if (!this.firstName || !this.firstName.trim() || !this.tablesNew.length) {
      this.toastrService.error('All fields need to be filled to create a Semantic layer');
      return false;
    }
    else {
      if (this.semanticLayers.find(ele => ele.sl_name.toUpperCase() === this.firstName.trim().toUpperCase() || !this.firstName.trim().length)) {
        this.toastrService.error("Please enter a unique name for the Semantic layer.");
        return false;
      }
    }
    return true;
  };

  public saveProcess() {
    if (this.isLowerDiv && !this.isUpperDiv) {
      this.createSemanticLayer();
    }
    else {
      this.checkEmpty();
    }
  }

  public disableLowerDiv() {
    this.isLowerDiv = true;
    this.isUpperDiv = false;
  }

  public disableUpperDiv() {
    this.isLowerDiv = false;
    this.isUpperDiv = true;
  }

  public reset() {
    if (this.isLowerDiv && !this.isUpperDiv) {
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
