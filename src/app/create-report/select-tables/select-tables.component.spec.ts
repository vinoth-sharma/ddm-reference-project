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
    component.objectExplorerSidebarService.getCustomTables.
        subscribe(data => expect(data).toBe(a));
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
    expect(component.selectedTables[0].tables['tables']).
      toEqual(updateSemanticList, 'semanticList');
  });

  it('should getRelatedTables execute', () => {
    fixture.detectChanges();
    component.getRelatedTables(selectedTable, 0);
    fixture.detectChanges();
    let a = component.selectedTables.
              some(table => table['table'] && table['table']['mapped_table_id']);
    expect(a).toBe(false);           
  });

  it('should execute setSelectedTable ', () => {
       const  event = {
          'source' : {
            'selected' : {
              "_mostRecentViewValue": 'checking length of text',
              'group': {
                'label': 'Related Tables'
              }
            }
          }
         };
    fixture.detectChanges();
    component = fixture.componentInstance;
    spyOn(component, 'setSelectedTable').and.callThrough(); //callThrough()
    component.setSelectedTable(selectedTable, 0, event);
    expect(component.setSelectedTable).toHaveBeenCalled();
  });

  it('should execute getFavoriteSortedTables', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'getFavoriteSortedTables').and.callThrough(); //callThrough()
    component.getFavoriteSortedTables('tables');
    expect(component.getFavoriteSortedTables).toHaveBeenCalled();
  }));

  it('should execute doColumnAliasSpaceValidation', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'doColumnAliasSpaceValidation').and.callThrough(); //callThrough()
    component.doColumnAliasSpaceValidation();
    expect(component.doColumnAliasSpaceValidation).toHaveBeenCalled();
  }));

  it('should execute spaceHandler' , fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'spaceHandler').and.callThrough(); //callThrough()
    component.spaceHandler(' ganesh   ');
    expect(component.spaceHandler).toHaveBeenCalled();
  }));

  it('should execute getCalculatedData', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'getCalculatedData').and.callThrough(); //callThrough()
    component.getCalculatedData();
    expect(component.getCalculatedData).toHaveBeenCalled();
  }));

  it('should deleted key, ', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'deleteKey').and.callThrough(); //callThrough()
    component.deleteKey(selectedTable, 0);
    expect(component.deleteKey).toHaveBeenCalled();
  }));

  it('should execute filterColumn', fakeAsync(() =>{
    fixture.detectChanges();
    spyOn(component, 'filterColumn').and.callThrough(); //callThrough()
    component.filterColumn('hh', 0);
    expect(component.filterColumn).toHaveBeenCalled();
  }));

  it('should execute filter key', fakeAsync(() =>{
    fixture.detectChanges();
    spyOn(component, 'filterKey').and.callThrough(); //callThrough()
    component.filterKey('hh', 0, 'primary');
    expect(component.filterKey).toHaveBeenCalled();
  }));

  it('should execute create formula', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'createFormula').and.callThrough(); //callThrough()
    component.createFormula();
    expect(component.createFormula).toHaveBeenCalled();
  }));

  it('should execute check error', fakeAsync(() =>{
    fixture.detectChanges();
    spyOn(component, 'checkErr').and.callThrough(); //callThrough()
    component.checkErr();
    expect(component.checkErr).toHaveBeenCalled();
  }));

  it('should execute add new row method', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'addRow').and.callThrough(); //callThrough()
    component.addRow(5);
    expect(component.addRow).toHaveBeenCalled();
  }));

  it('should execute disableFields method', fakeAsync(() => {
    fixture.detectChanges(); 
    spyOn(component, 'disableFields').and.callThrough(); //callThrough()
    component.disableFields();
    expect(component.disableFields).toHaveBeenCalled();
  }));

  it('should execute resetSelected method', fakeAsync(() => {
    fixture.detectChanges(); 
    spyOn(component, 'resetSelected').and.callThrough(); //callThrough()
    component.resetSelected(selectedTable);
    expect(component.resetSelected).toHaveBeenCalled();
  }));

  it('should execute addKey method', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'addKey').and.callThrough(); //callThrough() 
    component.addKey(selectedTable);
    expect(component.addKey).toHaveBeenCalled();
  }));

  it('should check isOpened method', fakeAsync(() => {
      fixture.detectChanges();
      spyOn(component, 'isOpened').and.callThrough(); //callThrough()
      component.isOpened('', 0, 'table');
      expect(component.isOpened).toHaveBeenCalled();
    }));

  it('should execute isDisabled method', fakeAsync(() => {
      fixture.detectChanges();
      spyOn(component, 'isDisabled').and.callThrough(); //callThrough()
      component.isDisabled(true);
      expect(component.isDisabled).toHaveBeenCalled();
    }));

  it('should execute selectionDone method', fakeAsync(() => {
      fixture.detectChanges();
      const event = {
        'column': {
          'checked': true,
          'aliasName': ['a','b','c']
        }
      };
      spyOn(component, 'selectionDone').and.callThrough(); //callThrough()
      component.selectionDone(event,0);
      expect(component.selectionDone).toHaveBeenCalled();
    }));
});




