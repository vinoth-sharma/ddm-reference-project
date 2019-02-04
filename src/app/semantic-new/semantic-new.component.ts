import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import Utils from "../../utils";

@Component({
  selector: 'app-semantic-new',
  templateUrl: './semantic-new.component.html',
  styleUrls: ['./semantic-new.component.css']
})
export class SemanticNewComponent {

  public slid;
  public existingTables;
  public slData;
  public slRes;
  public slArray;
  public dropDownSettings = {};
  public userId;
  public nameRepeat = 0;
  public semList;
  index;
  public resSlName;
  public newSlName;
  public newSlTables = [];

  constructor(
    private http: Http,
    private toastr: ToastrService,
    private AuthenticationService: AuthenticationService,
    private semanticNewService: SemanticNewService,
    private router: Router
  ) {
    this.AuthenticationService.Method$.subscribe((userid) =>
      this.userId = userid);
  }

  // Check SL name for duplicates by getting SL list and run service call on success
  getSlList(firstName) {
    Utils.showSpinner();
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      this.resSlName = res;
      this.semList = this.resSlName.data.sl_list;
      for (var i = 0; i < this.semList.length; i++)
        if (this.semList[i].sl_name.includes(firstName.trim()) == true) {
          this.nameRepeat = 1;
        }
      if (this.nameRepeat == 1) {
        this.toastr.error('This Semantic Layer name already exists');
        this.nameRepeat = 0;
        Utils.hideSpinner();
      }
      else {
        this.createSemanticLayer(firstName);
      }
    }, (err) => { this.toastr.error(err['message']) }
    )
  }

  // Service call to create SL
  createSemanticLayer(firstName) {
    let slBody = {};
    this.newSlName = firstName.trim();
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
  checkFirstName(firstName) {
    if (!firstName || !firstName.trim() || !this.newSlTables.length) {
      return this.toastr.info('All fields need to be filled to create a SL');
    } else {
      this.getSlList(firstName);
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

  ngOnInit() {
    this.dropDownSettings = {
      singleSelection: false,
      textField: 'mapped_table_name',
      enableCheckAll: false,
      idField: 'sl_tables_id',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.AuthenticationService.getTables(this.slid).subscribe(
      (res) => {
        this.slRes = res as object[];
        this.slData = this.slRes['data'];
        this.existingTables = this.slData['sl_table'];
      },
      (error) => { this.toastr.error[error['message']]});
  }
};