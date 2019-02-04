import { Component, OnInit } from '@angular/core';
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

  public semanticLayerId;
  public existingTables;
  public tablesData;
  public tables;
  public dropDownSettings = {};
  public userId;
  public nameRepeat = 0;
  public semanticLayerList;
  public firstName;
  index;
  public resSlName;
  public newSlName;
  public newSlTables = [];

  constructor(
    private toastr: ToastrService,
    private AuthenticationService: AuthenticationService,
    private semanticNewService: SemanticNewService,
  ) {
    this.AuthenticationService.Method$.subscribe((userid) =>
      this.userId = userid);
  }

  ngOnInit() {
    this.dropDownSettings = {
      singleSelection: false,
      textField: 'mapped_table_name',
      enableCheckAll: false,
      idField: 'sl_tables_id',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    //getting all SL tables 
    this.AuthenticationService.getTables(this.semanticLayerId).subscribe(
      (res) => {
        this.tables = res as object[];
        this.tablesData = this.tables['data'];
        this.existingTables = this.tablesData['sl_table'];
      },
      (error) => { this.toastr.error[error['message']]});
  }

  // Check SL name for duplicates by getting SL list and run service call on success
  getSlList() {
    Utils.showSpinner();
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      this.resSlName = res;
      this.semanticLayerList = this.resSlName.data.sl_list;
      for (var i = 0; i < this.semanticLayerList.length; i++)
        if (this.semanticLayerList[i].sl_name.includes(this.firstName.trim())) {
          this.nameRepeat = 1;
        }
      if (this.nameRepeat == 1) {
        this.toastr.error('This Semantic Layer name already exists');
        this.nameRepeat = 0;
        Utils.hideSpinner();
      }
      else {
        this.createSemanticLayer();
      }
    }, (err) => { this.toastr.error(err['message']) }
    )
  }

  // Service call to create SL
  createSemanticLayer() {
    let slBody = {};
    this.newSlName = this.firstName.trim();
    slBody = { postTables: this.newSlTables, postUser: [this.userId], postName: this.newSlName };
    this.semanticNewService.saveSldetails(slBody).subscribe(
      res => {
        this.toastr.success(res['message']);
        Utils.hideSpinner();
      },
      err => {
        Utils.hideSpinner();
        return this.toastr.error(err.message['error'])
      }
    )
  }

  //  Use this for input validation
  checkFirstName() {
    if (!this.firstName || !this.firstName.trim() || !this.newSlTables.length) {
      this.toastr.info('All fields need to be filled to create a SL');
    } else {
      this.getSlList();
    }
  };

  //use this to add tables to array
  onItemSelect(item: any) {
    this.newSlTables.push(item.mapped_table_name);
    return this.newSlTables;
  };

  //use this to remove tables from array
  onItemDeSelect(item: any) {
    this.index = this.newSlTables.indexOf(item.mapped_table_name);
    this.newSlTables.splice(this.index, 1);
    return this.newSlTables;

  }
};