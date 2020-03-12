import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { SaveReportService } from "./save-report.service"
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from "@angular/router";
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Utils from "../../utils";
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';

@Component({
  selector: 'app-save-report',
  templateUrl: './save-report.component.html',
  styleUrls: ['./save-report.component.css']
})
export class SaveReportComponent implements OnInit {

  @Input() selectedReportId: number;
  @Input() selectedReportName: string = '';
  public userDetails = [];
  public userIds = [];
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public semanticId;
  public isDuplicate: boolean = false;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public fruitCtrl = new FormControl('', [Validators.required]);
  public filteredFruits: Observable<string[]>;
  public fruits: string[] = [];
  public allUsers: string[] = [];
  public defaultError = "There seems to be an error. Please try again later.";
  public userIdsCopy = [];
  public updateDataObject : any = {};

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  lastkeydown1: number = 0;
  constructor(private saveReportService: SaveReportService,
              private router: Router,
              private toasterService: NgToasterComponent,
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

  // only in ts
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

  // only in ts
  public getUsers() {
    this.saveReportService.getAllUsers(this.semanticId).subscribe(res => {
      this.userDetails = res['data'];
      let userDetails = this.userDetails;
      let userIds = [];
      userDetails.forEach(ele => { userIds.push(ele['user_name']); })
      this.allUsers = userIds;
    })
  }

  // only in ts
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
      this.getUseIds(input);
    }   
    this.fruitCtrl.setValue('');
  }

  haveAccessToSl(value) {
    // let userDetails = this.userDetails;
    const matchedUser = this.userDetails.find(item => item.user_name.toLowerCase().includes(value.toLowerCase()));
    if (!matchedUser) {
      this.toasterService.error('Oops! Seems like this user does not have access to the report or is not a part of the organisation. Please authorize him to view the report to continue'); 
      console.log('Oops! Seems like this user does not have access to the report or is not a part of the organisation. Please authorize him to view the report to continue'); 
    }
  }

  // only in ts
  getUseIds(user) {      // fetch userIds for the selected users 
    const matchedUser = this.userDetails.find(item => item.user_name === user);
    const userId = matchedUser ? matchedUser.user_id : '';
    // if (!this.userIdsCopy.includes(userId)) {
      this.userIdsCopy.push(userId);
      // }
    // Another way
    // this.userIdsCopy = [...new Set(this.userDetails.filter(item => item.user_name === user).map(item => item.user_id))];
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

  // not being used
  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  // only in ts
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUsers.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  updateData() {
    let options = {};
    Utils.showSpinner();
    options['user_id'] = this.userIdsCopy;
    options['report_list_id'] = this.selectedReportId;
    this.updateDataObject = options;
    this.saveReportService.shareToLandingPage(options).subscribe(
      res => {
        this.toasterService.success("Report has been shared")
        console.log("Report has been shared")
        Utils.hideSpinner();
        Utils.closeModals();
      })
    err => {
      this.toasterService.error(err.message || this.defaultError);
      console.log(err.message || this.defaultError);
    }
  };
}

