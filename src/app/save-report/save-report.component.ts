import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { SaveReportService } from "./save-report.service"
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from "@angular/router";
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';

@Component({
  selector: 'app-save-report',
  templateUrl: './save-report.component.html',
  styleUrls: ['./save-report.component.css']
})
export class SaveReportComponent implements OnInit {

  @Input() selectedReportId: number;
  @Input() selectedReportName: string;
  userDetails = [];
  userIds = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  semanticId;
  isDuplicate: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('', [Validators.required]);
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allUsers: string[] = [];
  defaultError = "There seems to be an error. Please try again later.";
  userIdsCopy = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  lastkeydown1: number = 0;
  constructor(private saveReportService: SaveReportService,
    private router: Router,
    private toasterService: ToastrService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allUsers.slice()));
  }

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
      if (this.semanticId) {
        this.getUsers();
      }
    });
  }

  reset() {
    this.fruits = [];
    this.fruitCtrl.setValue('');
    Utils.closeModals();
    this.userIds = [];
  }

  public getUsers() {
    this.saveReportService.getAllUsers(this.semanticId).subscribe(res => {
      this.userDetails = res['data'];
      let userDetails = this.userDetails;
      let userIds = [];
      userDetails.forEach(ele => { userIds.push(ele['user_name']); })
      this.allUsers = userIds;
    })
  }

  getErrorMessage() {
    if (this.fruits.includes(this.fruitCtrl.value)) {
      this.isDuplicate = true;
    }
    else {
      this.isDuplicate = false;
    }
  };

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    const value = event['option']['value'];
    this.getErrorMessage();
    if ((value || '').trim() && !this.isDuplicate) {
      this.fruits.push(value.trim());
    }
    this.getUseIds(input);
    this.fruitCtrl.setValue('');
  }

  // haveAccessToSl(value) {
  //   let userDetails = this.userDetails;
  //   userDetails.forEach(val => {
  //      if(!((val['user_name'].toLowerCase()).indexOf(value.toLowerCase()) !== -1)){
  //     this.toasterService.error('Oops! Seems like this user does not have access to the report or is not a part of the organisation. Please authorize him to view the report to continue');
  //   }
  //   })  
  //     }

  getUseIds(user) {      // fetch userIds for the selected users 
    let userDetails = this.userDetails;
    let userObj = [];
    userObj = userDetails.filter(function (Obj) {
      if (Obj['user_name'] === user) {
        return Obj
      }
    })
    let userIds;
    userObj.forEach(obj => {
      userIds = obj['user_id'];
    })
    if (!this.userIdsCopy.includes(userIds)) {
      this.userIdsCopy.push(userIds);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    let userDetails = this.userDetails;
    let userObj = [];
    userObj = userDetails.filter(function (Obj) {
      if (Obj['user_name'] === fruit) {
        return Obj
      }
    })
    let userIds;
    userObj.forEach(obj => {
      userIds = obj['user_id'];
    })
    this.userIdsCopy.splice(this.userIdsCopy.indexOf(userIds), 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUsers.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  updateData() {
    let options = {};
    Utils.showSpinner();
    options['user_id'] = this.userIdsCopy;
    options['report_list_id'] = this.selectedReportId;
    this.saveReportService.shareToLandingPage(options).subscribe(
      res => {
        this.toasterService.success("Report has been shared")
        Utils.hideSpinner();
        Utils.closeModals();
      })
    err => {
      this.toasterService.error(err.message || this.defaultError);
    }
  };
}

