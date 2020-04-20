import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { MaterialModule } from "../material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'angular-pipes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Utils from '../../utils';

import { RolesAndResponsibilitiesHomeComponent } from './roles-and-responsibilities-home.component';
import { HeaderComponent } from "../header/header.component";

describe('RolesAndResponsibilitiesHomeComponent', () => {
  let component: RolesAndResponsibilitiesHomeComponent;
  let fixture: ComponentFixture<RolesAndResponsibilitiesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolesAndResponsibilitiesHomeComponent, HeaderComponent, NgToasterComponent],
      imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, NgPipesModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndResponsibilitiesHomeComponent);
    component = fixture.componentInstance;
    let spyVar = spyOn(Utils, 'showSpinner')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
