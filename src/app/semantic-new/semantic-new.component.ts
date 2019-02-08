import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { ToastrService } from 'ngx-toastr';
import Utils from "../../utils";

@Component({
  selector: 'app-semantic-new',
  templateUrl: './semantic-new.component.html',
  styleUrls: ['./semantic-new.component.css']
})

export class SemanticNewComponent {

  public dropDownSettings = {
    singleSelection: false,
    textField: 'mapped_table_name',
    enableCheckAll: false,
    idField: 'sl_tables_id',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };
  public semanticLayerId;
  public existingTables = [];
  public userId;
  public semanticLayers = [];
  public firstName;
  public toasterMessage = ('')
  public tables = [];

  constructor(private toastr: ToastrService, private AuthenticationService: AuthenticationService, private semanticNewService: SemanticNewService) {
    this.AuthenticationService.Method$.subscribe(userId => this.userId = userId);
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers });
  }

  ngOnInit() {
    this.getTables();
  }

  // get all semantic layers list
  public getSemanticLayers() {
    Utils.showSpinner();
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      Utils.hideSpinner();
      this.semanticLayers = res['data']['sl_list'];
      this.toastr.success(this.toasterMessage);
    }, (err) => {
      this.toastr.error(err['message'])
    })
  };

  //getting all tables
  public getTables() {
    this.AuthenticationService.getTables(this.semanticLayerId).subscribe(
      (res) => {
        this.existingTables = res['data']['sl_table'];
      },
      (error) => this.toastr.error[error['message']]);
  }

  // function to call create SL service function
  public createSemanticLayer() {
    //calls validateInput function and checks for true or false
    if (!this.validateInputField()) return;
    let data = {
      sl_name: this.firstName.trim(),
      user_id: [this.userId],
      original_table_name_list: this.tables
    }
    Utils.showSpinner();
    this.semanticNewService.createSemanticLayer(data).subscribe(
      res => {
        this.toasterMessage = res['message'];
        //Calls the function to refresh the semantic layers list on success
        this.getSemanticLayers();
      },
      err => {
        this.toastr.error(err['message'])
        Utils.hideSpinner();
      }
    )
  }

  //Validates input for duplicate and empty fields
  validateInputField() {
    if (!this.firstName || !this.firstName.trim() || !this.tables.length) {
      this.toastr.info('All fields need to be filled to create a SL');
      return false;
    }
    else {
      for (var i = 0; i < this.semanticLayers.length; i++) {
        if (this.semanticLayers[i].sl_name.includes(this.firstName.trim())) {
          this.toastr.error('This Semantic Layer name already exists');
          return false;
        }
      }
    }
    return true;
  };

  //use this to add tables to array
  onItemSelect(item: any) {
    this.tables.push(item.mapped_table_name);
    return this.tables;
  };

  //use this to remove tables from array
  onItemDeSelect(item: any) {
    let index = this.tables.indexOf(item.mapped_table_name);
    this.tables.splice(index, 1);
    return this.tables;
  }

};