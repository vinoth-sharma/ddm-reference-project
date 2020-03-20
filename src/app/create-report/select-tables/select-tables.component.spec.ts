import { async, 
          ComponentFixture,
          TestBed, 
          inject, 
          fakeAsync, 
          tick, 
          getTestBed 
        } from '@angular/core/testing';
import { SelectTablesComponent } from './select-tables.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderByPipe } from '../../shared-components/filters/order-by.pipe';
import { MaximumCharacterPipe } from '../../shared-components/maximum-character.pipe';
import { spaceFormaterString } from '../../custom-directives/spaceFormaterString.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSelectModule } from '@angular/material/select';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import { of, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";
import { By } from '@angular/platform-browser';

describe('SelectTablesComponent', () => {
  let component: SelectTablesComponent;
  let fixture: ComponentFixture<SelectTablesComponent>;
  let tableSelectElement;
  const semanticList = [{
    'original_column_name':  ["INV_CHRG_TO_GMBA_SS_CD", "INV_CHRG_BUNS_FCN_CD", "BARS_ORD_TYP_NO"],
    'mapped_column_name': ["INV_CHRG_TO_GMBA_SS_CD", "INV_CHRG_BUNS_FCN_CD", "BARS_ORD_TYP_NO"],
    'original_table_name': "MV_ERD",
    'view_to_admins': true,
    'mapped_table_name': "MV_ERD1",
    'is_favourite': false,
    'column_properties':[{'data_type': "VARCHAR2",
                        'mapped_column_name': "INV_CHRG_TO_GMBA_SS_CD",
                        'original_column_name': "INV_CHRG_TO_GMBA_SS_CD",
                        'column': "INV_CHRG_TO_GMBA_SS_CD",
                        'column_view_to_admins': true
                      },
                    {
                      'data_type': "NUMBER",
                      'mapped_column_name': "INV_CHRG_BUNS_FCN_CD",
                      'original_column_name': "INV_CHRG_BUNS_FCN_CD",
                      'column': "INV_CHRG_BUNS_FCN_CD",
                    ' column_view_to_admins': true
                    }],
    'sl_tables_id': 3007,
    'column_view_to_admins':[true,true,true,true,true]
        }];

  const tables = {
    "tables":semanticList,
    "custom tables": [],
    "related tables": []
  };
  const selectedTable = {
    "tables": {"tables": tables, "custom tables": [], "related tables": []},
    "disabled": false,
    "tableId": 2962,
    "table": {"original_column_name": [{
                                        "data_type": "VARCHAR2",
                                        "mapped_column_name": "DELVRY_TYPE_CD_6000",
                                        "original_column_name": "DELVRY_TYPE_CD_6000",
                                        "column": "DELVRY_TYPE_CD_6000",
                                        "column_view_to_admins": true
                                      },
                                      {
                                        "data_type": "VARCHAR2",
                                        "mapped_column_name": "DELVRY_TYPE_CD_6200",
                                        "original_column_name": "DELVRY_TYPE_CD_6200",
                                        "column": "DELVRY_TYPE_CD_6200",
                                        "column_view_to_admins": true
                                      }],
              "mapped_column_name": ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200",
                                    "OPT_ENG","OPT_TRANS_TRANSMISSION",
                                    "OPT_TRANS_TRN"],
              "original_table_name": "VEHICLE_INFO",
              "view_to_admins": true, 
              "mapped_table_name": "VEHICLE_INFO", 
              "is_favourite": false,
              "column_properties":[
                {
                "data_type": "VARCHAR2",
                "mapped_column_name": "DELVRY_TYPE_CD_6000",
                "original_column_name": "DELVRY_TYPE_CD_6000",
                "column": "DELVRY_TYPE_CD_6000",
                "column_view_to_admins": true
                },
                {
                  "data_type": "VARCHAR2",
                  "mapped_column_name": "DELVRY_TYPE_CD_6200",
                  "original_column_name": "DELVRY_TYPE_CD_6200",
                  "column": "DELVRY_TYPE_CD_6200",
                  "column_view_to_admins": true
                  }],
                "sl_tables_id": 2962,
                "column_view_to_admins":[true,true,true,true],
                "tableType": "Tables"
  
            },
    "tableType": "Tables",
    "columns": [],
    "columnAlias": {},
    "join": "",
    "keys": [{
                "primaryKey": "",
                "operation": "=",
                "foreignKey": ""
              }],
    "originalColumns": [{
                          "data_type": "VARCHAR2",
                          "mapped_column_name": "DELVRY_TYPE_CD_6000",
                          "original_column_name": "DELVRY_TYPE_CD_6000",
                          "column": "DELVRY_TYPE_CD_6000",
                          "column_view_to_admins": true
                        }, {
                          "data_type": "VARCHAR2",
                          "mapped_column_name": "DELVRY_TYPE_CD_6200",
                          "original_column_name": "DELVRY_TYPE_CD_6200",
                          "column": "DELVRY_TYPE_CD_6200",
                          "column_view_to_admins": true
                        }],
    "columnsForMultiSelect": ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200"]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule,
                MatFormFieldModule,
                MatSelectModule,
                MatGridListModule,
                AngularMultiSelectModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule],
      declarations: [ SelectTablesComponent, OrderByPipe, MaximumCharacterPipe, spaceFormaterString ],
      providers: [MatSnackBar],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.selectedTables =[ {tables} ];
    fixture.detectChanges();
    tableSelectElement = fixture.debugElement.query(By.css('#table'));
    spyOn(component, 'setSelectedTable').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should check select table from SharedDataService', fakeAsync(async() => {
  //   const a = ['a', '1', 'b', '2'];
  //   component = fixture.componentInstance;
  //   component.sharedDataService.setSelectedTables(a); 
  //   // tick();
  //   fixture.detectChanges();
  //   // component.sharedDataService.selectedTables.
  //   // subscribe(data =>{
  //   //   expect(data).toBe(a);
  //   // });
  // }));

  it('should check getTables', fakeAsync(async() => {
    const a = ['a', '1', 'b', '2']; // initialize variable
    component = fixture.componentInstance; // create component instance
    // passing input params to setTables() function in service
    component.objectExplorerSidebarService.setTables(a);
    tick(); // wait for promises execution
    fixture.detectChanges(); // detect changes
    // subscribe variable to get result
    component.objectExplorerSidebarService.getTables.subscribe(data => 
      expect(data).toBe(a)); // expect the result
  }));

  it('should check getCustomTables', fakeAsync(async() => {
    const a = ['a', '1', 'b', '2'];
    component = fixture.componentInstance;
    component.objectExplorerSidebarService.setCustomTables(a);
    tick();
    fixture.detectChanges();
    component.objectExplorerSidebarService.getCustomTables.subscribe(data => expect(data).toBe(a));
  }));

  it('should update tables', () => {
    const updateSemanticList = [{
      'original_column_name':  ["INV_CHRG_TO_GMBA_SS_CD", "INV_CHRG_BUNS_FCN_CD"],
      'mapped_column_name': ["INV_CHRG_TO_GMBA_SS_CD", "INV_CHRG_BUNS_FCN_CD"],
      'original_table_name': "MV_ERD",
      'view_to_admins': true,
      'mapped_table_name': "MV_ERD1",
      'is_favourite': false,
      'column_properties':[{'data_type': "VARCHAR2",
                          'mapped_column_name': "INV_CHRG_TO_GMBA_SS_CD",
                          'original_column_name': "INV_CHRG_TO_GMBA_SS_CD",
                          'column': "INV_CHRG_TO_GMBA_SS_CD",
                          'column_view_to_admins': true
                        }],
      'sl_tables_id': 3007,
      'column_view_to_admins':[true,true]
    }];
    const updateTables = {
            "tables":updateSemanticList,
            "custom tables": [],
            "related tables": []
          };      

    component.selectedTables =[ {tables}];
    fixture.detectChanges();
    component.updateTables(updateTables, 'table');
    fixture.detectChanges();
    expect(component.selectedTables[0].tables['tables']).toEqual(updateSemanticList, 'semanticList');
  });

  it('should getRelatedTables execute', () => {
    fixture.detectChanges();
    component.getRelatedTables(selectedTable, 0);
    fixture.detectChanges();    
  
  });

  it('should execute setSelectedTable ', () => {
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.setSelectedTable(selectedTable, 0, 'Related Tables');
  });

  it('should execute getFavoriteSortedTables', fakeAsync(() => {
    fixture.detectChanges();
    component.getFavoriteSortedTables('tables');
  }));

  it('should execute doColumnAliasSpaceValidation', fakeAsync(() => {
    fixture.detectChanges();
    component.doColumnAliasSpaceValidation();
  }));

  it('should execute spaceHandler' , fakeAsync(() => {
    fixture.detectChanges();
    component.spaceHandler(' ganesh   ');
  }));

  it('should execute getCalculatedData', fakeAsync(() => {
    fixture.detectChanges();
    component.getCalculatedData();
  }));

  it('should deleted key, ', fakeAsync(() => {
    component.deleteKey(selectedTable, 0);
    fixture.detectChanges();
  }));

  it('should execute filterColumn', fakeAsync(() =>{
    component.filterColumn('hh', 0);
    fixture.detectChanges();
  }));

  it('should execute filter key', fakeAsync(() =>{
    component.filterKey('hh', 0, 'primary');
    fixture.detectChanges();
  }));

  it('should execute create formula', fakeAsync(() => {
    fixture.detectChanges();
    component.createFormula();
  }));

  it('should execute check error', fakeAsync(() =>{
    fixture.detectChanges();
    component.checkErr();
  }));

  it('should execute add new row method', fakeAsync(() => {
    fixture.detectChanges();
    component.addRow(5);
  }));

  it('should execute disableFields method', fakeAsync(() => {
    fixture.detectChanges(); 
    component.disableFields();
  }));

  it('should execute resetSelected method', fakeAsync(() => {
    fixture.detectChanges(); 
    component.resetSelected(selectedTable);
  }));

  it('should execute addKey method', fakeAsync(() => {
    fixture.detectChanges(); 
    component.addKey(selectedTable);
  }));

  it('should check isOpened method', fakeAsync(() => {
      fixture.detectChanges();
      component.isOpened('', 0, 'table');
    }));

  it('should execute isDisabled method', fakeAsync(() => {
      fixture.detectChanges();
      component.isDisabled(true);
    }));

  it('should execute selectionDone method', fakeAsync(() => {
      fixture.detectChanges();
      const event = {
        'column': {
          'checked': true,
          'aliasName': ['a','b','c']
        }
      };
      component.selectionDone(event,0);
    }));
});




