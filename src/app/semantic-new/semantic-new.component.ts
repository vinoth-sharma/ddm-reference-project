import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthenticationService } from '../authentication.service';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';

@Component({
  selector: 'app-semantic-new',
  templateUrl: './semantic-new.component.html',
  styleUrls: ['./semantic-new.component.css']
})
export class SemanticNewComponent {

  public slid;
  public slTables;
  public slData;
  public slRes;
  public slArray;
  public dropDownSettings = {};
  public sendTables = [];
  public userid;
  public nameRepeat = 0;
  index;
  res;
  loading;
  sem;
  firstName;
  public sl_name;
  public user_id;
  public table_name = [];

  constructor(private http: Http, private toastr: ToastrService, private user: AuthenticationService, private semanticNew: SemanticNewService, private router: Router) {
    this.user.Method$.subscribe((userid) =>
    this.userid = userid);
  }


  // Check SL name for duplicates and service call
  callSldetails(firstName) {
    let slBody = {};
    this.user.getSldetails(this.userid).subscribe((res) =>
    {this.res = res;
      console.log(this.res);
      this.sem = this.res.data['sl_list'];
      console.log(this.sem);
      for (var i = 0; i < this.sem.length; i++)
      if (this.sem[i].sl_name == firstName.trim()) {
        this.nameRepeat = 1;
        console.log(this.sem[i].sl_name);
      }
      if (this.nameRepeat == 1) {
        this.toastr.error('This Semantic Layer name already exists');
        this.nameRepeat = 0;
        return this.loading = false; 
      } else {
      this.sl_name = firstName.trim();
      slBody = { postTables: this.table_name , postUser: [this.userid] , postName: this.sl_name };
      }
      this.semanticNew.postSldetails(slBody).subscribe (
        res => {console.log(res); 
                this.toastr.success(res['message']);
                 this.user.getSldetails(this.userid); 
                return this.loading = false; }, 
        err => {return this.toastr.error(err.message['error'])}
      )
    } , (err) => {console.log('err')}
    )
  }

  //  Use this for input validation
  uniqueInput(firstName) {
    this.loading = true;
    // let slBody={};
    if (firstName == undefined || firstName.trim() == "" ||  this.table_name.length == 0 ) {
      this.toastr.info('All fields need to be filled to create a SL');
      return this.loading = false; 
    } else {
      this.callSldetails(firstName);
      }
  };

  //use this to reset ngModel
  valuechange(newValue) {
   return this.firstName = newValue;
    console.log(newValue);
  }

  //use this to add tables to array
  onItemSelect(item: any) {
    this.sendTables.push(item.mapped_table_name);
    console.log(this.sendTables);
    return this.table_name = this.sendTables;
  };

  //use this to remove tables from array
  onItemDeSelect(item: any) {
    this.index = this.sendTables.indexOf(item.mapped_table_name);
    if (this.index > -2) {
      this.sendTables.splice(this.index, 1);
    }
    console.log(this.sendTables);
    return this.table_name = this.sendTables;
   
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

    this.user.getTables(this.slid).subscribe(
      (res) => {
        this.slRes = res as object[];
        console.log(this.slRes);
        this.slData = this.slRes['data'];
        this.slTables = this.slData['sl_table'];
        console.log(this.slTables);
      },
      (error) => { console.log("FAILURE") });
  }

};







