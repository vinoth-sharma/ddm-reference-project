import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import {  MatPaginator } from '@angular/material/paginator';
// import {  MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { MaterialModule } from "../material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgPipesModule } from 'angular-pipes';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Utils from '../../utils';

import { SortTableComponent } from './sort-table.component';
import { HeaderComponent } from "../header/header.component";
import { SecurityModalComponent } from '../security-modal/security-modal.component';
import { PrivilegeModalComponent } from '../privilege-modal/privilege-modal.component';

// import { AppInjector } from "../../app-injector";
// import { Injector } from "@angular/core";




// import { Component } from '@angular/core';
// import { NgModule } from '@angular/core';

describe('SortTableComponent', () => {
  let component: SortTableComponent;
  let fixture: ComponentFixture<SortTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortTableComponent,HeaderComponent,SecurityModalComponent,PrivilegeModalComponent, NgToasterComponent],
      imports : [MaterialModule,CommonModule,FormsModule, ReactiveFormsModule, NgPipesModule, HttpClientTestingModule, RouterTestingModule,BrowserAnimationsModule]
      // providers : [ { provide: Utils, useClass: trialService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortTableComponent);
    component = fixture.componentInstance;
    let spyVar = spyOn(Utils,'showSpinner')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
