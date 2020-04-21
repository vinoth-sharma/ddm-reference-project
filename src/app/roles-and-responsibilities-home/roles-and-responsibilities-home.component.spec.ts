import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { NgModule } from '@angular/core';
import { MaterialModule } from "../material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'angular-pipes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Utils from '../../utils';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { RolesAndResponsibilitiesHomeComponent } from './roles-and-responsibilities-home.component';
import { HeaderComponent } from "../header/header.component";
import { AuthenticationService } from '../authentication.service';

@NgModule({
  imports: [MatPaginator, MatSort, MatTableDataSource]
})

class TestClass {
}

fdescribe('RolesAndResponsibilitiesHomeComponent', () => {
  let component: RolesAndResponsibilitiesHomeComponent;
  let fixture: ComponentFixture<RolesAndResponsibilitiesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolesAndResponsibilitiesHomeComponent, HeaderComponent, NgToasterComponent],
      imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, NgPipesModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [NgLoaderService, AuthenticationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndResponsibilitiesHomeComponent);
    component = fixture.componentInstance;
    spyOn(Utils, 'showSpinner')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check ngOnInit()', () => {
    spyOn(component, 'tableSorting');

    component.ngOnInit();

    expect(component.tableSorting).toHaveBeenCalled();
    expect(Utils.showSpinner).toHaveBeenCalled();
    expect(component.isEmptyTables).toEqual(false);
  })

  it('should test the tableSorting', () => {
    let service = fixture.debugElement.injector.get(AuthenticationService);

    service.getUser().subscribe(res => {
      expect(component.isEmptyTables).toEqual(false);
      spyOn(Utils, 'hideSpinner')
      expect(component.rarList).toEqual(res);
      expect(Utils.showSpinner).toHaveBeenCalled();
      expect(component.dataSource.sort).toEqual(component.sort)
      expect(component.dataSource.paginator).toEqual(component.paginator)
      expect(Utils.hideSpinner).toHaveBeenCalled();
    })
  })

  it('should test routing', () => {
    spyOn(component.router, 'navigate');

    component.routeBack();

    expect(component.router.navigate).toHaveBeenCalledWith(['semantic/sem-sl/sem-existing'])
  })

});