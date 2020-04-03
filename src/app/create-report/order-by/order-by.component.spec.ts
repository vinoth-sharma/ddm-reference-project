import { async, 
         ComponentFixture,
         TestBed, 
         inject, 
         fakeAsync, 
         tick, 
         getTestBed,
         discardPeriodicTasks 
      } from '@angular/core/testing';
import { OrderByComponent } from './order-by.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spaceFormaterString } from '../../custom-directives/spaceFormaterString.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MaximumCharacterPipe } from '../../shared-components/maximum-character.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse,HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { element } from 'protractor';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { SharedDataService } from '../shared-data.service';
import { MatSnackBar } from "@angular/material/snack-bar";

describe('OrderByComponent', () => {
  let component: OrderByComponent;
  let fixture: ComponentFixture<OrderByComponent>;
  let shareService: SharedDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ 
                FormsModule, 
                MatFormFieldModule, 
                MatInputModule, 
                NoopAnimationsModule,
                RouterTestingModule.withRoutes([]),
                MatSelectModule,
                MatGridListModule,
                MatIconModule,
                MatCardModule,
                HttpClientTestingModule
              ],
      declarations: [ 
                      OrderByComponent,
                      spaceFormaterString, 
                      MaximumCharacterPipe 
                    ],
      providers: [ MatSnackBar, SharedDataService , NgToasterComponent ]              
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderByComponent);
    component = fixture.componentInstance;
    component.selectedTables = [
      {
        tables: {tables:[{
          column_view_to_admins:  [true, true, true, true ],
          view_to_admins: true,
          sl_tables_id: 2962,
          column_properties: [
            {
              column: "DELVRY_TYPE_CD_6000",
              data_type: "VARCHAR2",
              original_column_name: "DELVRY_TYPE_CD_6000",
              mapped_column_name: "DELVRY_TYPE_CD_6000",
              column_view_to_admins: true
            },
            {
              column: "DELVRY_TYPE_CD_6200",
              data_type: "VARCHAR2",
              original_column_name: "DELVRY_TYPE_CD_6200",
              mapped_column_name: "DELVRY_TYPE_CD_6200",
              column_view_to_admins: true
            }
          ],
          mapped_table_name: "VEHICLE_INFO",
          is_favourite: false,
          original_table_name: "VEHICLE_INFO",
          original_column_name: ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200", "OPT_ENG", "OPT_TRANS_TRANSMISSION"],
          mapped_column_name: ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200", "OPT_ENG", "OPT_TRANS_TRANSMISSION"],
          select_table_name: "VEHICLE_INFO",
          select_table_id: 2962,
        }], 'custom tables': [], 'related tables': []},
        disabled: false,
        tableId: 2962,
        table: {
          column_view_to_admins: [true,true,true,true,true],
          view_to_admins: true, 
          sl_tables_id: 2962, 
          column_properties: [
            {
              column: "DELVRY_TYPE_CD_6000",
              data_type: "VARCHAR2",
              original_column_name: "DELVRY_TYPE_CD_6000",
              mapped_column_name: "DELVRY_TYPE_CD_6000",
              column_view_to_admins: true
            },
            {
              column: "DELVRY_TYPE_CD_6200",
              data_type: "VARCHAR2",
              original_column_name: "DELVRY_TYPE_CD_6200",
              mapped_column_name: "DELVRY_TYPE_CD_6200",
              column_view_to_admins: true
            }
          ], 
          mapped_table_name: "VEHICLE_INFO",
          is_favourite: false,
          original_table_name: "VEHICLE_INFO",
          original_column_name: ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200", "OPT_ENG"],
          mapped_column_name: ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200", "OPT_ENG"],
          select_table_name: "VEHICLE_INFO",
          select_table_id: 2962
        },
        tableType: "Tables",
        columns: ["ALLOC_GRP_CD"],
        columnAlias: {},
        join: "",
        keys: [{
          primaryKey: "",
          operation: "=",
          foreignKey: ""
        }],
        originalColumns:[  {
                      column: "DELVRY_TYPE_CD_6000",
                      data_type: "VARCHAR2",
                      original_column_name: "DELVRY_TYPE_CD_6000",
                      mapped_column_name: "DELVRY_TYPE_CD_6000",
                      column_view_to_admins: true
                    },
                  {
                    column: "DELVRY_TYPE_CD_6200",
                    data_type: "VARCHAR2",
                    original_column_name: "DELVRY_TYPE_CD_6200",
                    mapped_column_name: "DELVRY_TYPE_CD_6200",
                    column_view_to_admins: true
                  }],
        columnsForMultiSelect: ["DELVRY_TYPE_CD_6000", "DELVRY_TYPE_CD_6200", "OPT_ENG"],
        select_table_alias: "T_2962"
      }
    ];
  });

  describe('Simple HTML', ( ) => { 
    beforeEach(() => {
      fixture.detectChanges();
    });

    // it('should get mat-card', async(async() => {
    //   fixture.detectChanges();
    //   const bannerDe: DebugElement = fixture.debugElement;
    //   const bannerEl: HTMLElement = bannerDe.nativeElement;
    //   component = fixture.componentInstance;
    //   await fixture.whenStable();
    //   console.log(bannerEl.querySelector('.order-by-data').textContent, 'textContent---');
    //   fixture.detectChanges();
    //   expect(bannerEl.querySelector('.order-by-data').textContent.length).toEqual(54);
    // }));
  });

  describe('Execute type script', ( ) => { 
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should check getSelectedTableData', fakeAsync(() => {
      fixture.detectChanges();
      let result = JSON.parse(JSON.stringify(component.selectedTables));
      let mySpy = spyOn(component, 'getSelectedTableData').and.callThrough(); //callThrough()
      component.getSelectedTableData();
      let sharedDataService = TestBed.get(SharedDataService);
      let myService = spyOn(sharedDataService, "setSelectedTables").and.returnValue(of(result));
      expect(component.selectedTables).toEqual(result);
      expect(sharedDataService).toBeDefined();
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1); 
    }));

    it('should check getColumns method', fakeAsync(() => {
      const columnWithTable = ["T_2962.DELVRY_TYPE_CD_6000","T_2962.DELVRY_TYPE_CD_6200"];
      spyOn(component, 'getColumns').and.callThrough(); // callThrough
      let columns = component.getColumns();
      expect(columns).toEqual(columnWithTable);
      expect(component.getColumns).toHaveBeenCalled();
    }));

    it('should execute getInitialState method', fakeAsync(() =>{
      fixture.detectChanges();
      component.columnWithTable = ['a', 'b', 'c', 'd'];
      const res = [{
        tableId: null,
        table: null,
        selectedColumn: null,
        columns: [],
        orderbySelected: 'ASC',
        columnDetails: JSON.parse(JSON.stringify(['a', 'b', 'c', 'd']))
      }];
      fixture.detectChanges();
      let mySpy = spyOn(component, 'getInitialState').and.callThrough(); // callThrough
      let initialState = component.getInitialState();
      expect(component.getInitialState).toHaveBeenCalled();
      expect(initialState).toEqual(res);
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should execute removeDeletedTableData method', fakeAsync(() => {
      fixture.detectChanges();
      component.columnWithTable = ['a','b', 'c', 'd', 'e', 'f'];
      const columnWithTable = ['a', 'b', 'c', 'd', 'e', 'f'];
      component.orderbyData = [{
                                tableId: null,
                                table: null,
                                columns: [],
                                selectedColumn: null,
                                orderbySelected: 'ASC',
                                columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                              },
                              {
                                tableId: null,
                                table: null,
                                columns: [],
                                selectedColumn: null,
                                orderbySelected: 'ASC',
                                columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                              }];
      fixture.detectChanges();
      let n = component.orderbyData.length;
      let mySpy = spyOn(component, 'removeDeletedTableData').and.callThrough(); // callThrough
      component.removeDeletedTableData(component.orderbyData);
      expect(component.removeDeletedTableData).toHaveBeenCalled();
      fixture.detectChanges();
      let n1 = component.orderbyData.length;
      expect(n1).toBe(n-1);
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should execute empty method', fakeAsync(() => {
        fixture.detectChanges();
        let mySpy = spyOn(component,'isEmpty').and.callThrough(); // callThrough
        let isEmpty = component.isEmpty('');
        expect(component.isEmpty).toHaveBeenCalled();
        expect(isEmpty).toBe(true);
        expect(mySpy).toBeDefined();
        expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should execute calculateFormula method', fakeAsync(() => {
      const columnWithTable = ['a', '1', 'b', '2', 'c', 'd', 'e', 'f'];
      component.formulaArray1 = ["T_2989.BRAND ASC"];
      component.orderbyData = [{
                                tableId: null,
                                table: null,
                                columns: [],
                                selectedColumn: null,
                                orderbySelected: 'ASC',
                                columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                              },
                              {
                                tableId: null,
                                table: null,
                                columns: [],
                                selectedColumn: null,
                                orderbySelected: 'ASC',
                                columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                              }];
      fixture.detectChanges();                        
      let mySpy = spyOn(component,'calculateFormula').and.callThrough();// callThrough
      component.calculateFormula(0);
      expect(component.calculateFormula).toHaveBeenCalled();
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should execute formula method', fakeAsync(() => {
        fixture.detectChanges();
        let mySpy = spyOn(component,'formula').and.callThrough(); // callThrough
        component.formula();
        expect(component.formula).toHaveBeenCalled();
        expect(mySpy).toBeDefined();
        expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should check addRow ', async() => {
      const columnWithTable = ['a', '1', 'b', '2', 'c', 'd', 'e', 'f'];
      component.columnWithTable = ['a', '1', 'b', '2', 'c', 'd', 'e', 'f'];
      component.orderbyData = [{
                                  tableId: null,
                                  table: null,
                                  columns: [],
                                  selectedColumn: null,
                                  orderbySelected: 'ASC',
                                  columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                                },
                                {
                                  tableId: null,
                                  table: null,
                                  columns: [],
                                  selectedColumn: null,
                                  orderbySelected: 'ASC',
                                  columnDetails: JSON.parse(JSON.stringify(columnWithTable))
                                }];
      fixture.detectChanges();
      let n = component.orderbyData.length;
      let mySpy = spyOn(component,'addRow').and.callThrough(); // callThrough
      component.addRow();
      let n1 = component.orderbyData.length;
      expect(n1).toBe(n+1, 'checking add new row order by data');
      expect(component.addRow).toHaveBeenCalled();
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    });

    it('should delete selected orderBy', async() => {
      component.columnWithTable = ['a', '1', 'b', '2', 'c', 'd', 'e', 'f'];
      component.orderbyData = [{
                                  tableId: null,
                                  table: null,
                                  columns: [],
                                  selectedColumn: null,
                                  orderbySelected: 'ASC',
                                  columnDetails: JSON.parse(JSON.stringify(component.columnWithTable))
                                },
                                {
                                  tableId: null,
                                  table: null,
                                  columns: [],
                                  selectedColumn: null,
                                  orderbySelected: 'ASC',
                                  columnDetails: JSON.parse(JSON.stringify(component.columnWithTable))
                                }];
      fixture.detectChanges();
      const n = component.orderbyData.length;
      let mySpy = spyOn(component,'deleteRow').and.callThrough(); // callThrough
      component.deleteRow(0);
      const n1 = component.orderbyData.length;
      expect(n1).toBe(n-1, 'checking delete new row order by data');
      expect(component.deleteRow).toHaveBeenCalled();
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    });

    it('should execute filterTable method', fakeAsync(() => {
        const event = {
          target: {
            value: 'ga'
          },
          stopPropagation() { return false;}
        };
        component.columnWithTable = ['T_3007.INV_CHRG_TO_GMBA_SS_CD', 'T_3007.INV_CHRG_BUNS_FCN_CD', 
                                      'T_3007.BARS_ORD_TYP_NO', 'T_3007.NEW_USED_VEH_CD', 
                                      'T_3007.FAILED_EDITS_IND'];
        fixture.detectChanges();
        let mySpy = spyOn(component,'filterTable').and.callThrough(); // callThrough
        component.filterTable(event,0,true);
        expect(component.filterTable).toHaveBeenCalled();
        expect(mySpy).toBeDefined();
        expect(mySpy).toHaveBeenCalledTimes(1);
    }));

    it('should execute opened method', fakeAsync(() => {
      component.columnWithTable = ['T_3007.INV_CHRG_TO_GMBA_SS_CD', 'T_3007.INV_CHRG_BUNS_FCN_CD', 
                                      'T_3007.BARS_ORD_TYP_NO', 'T_3007.NEW_USED_VEH_CD', 
                                      'T_3007.FAILED_EDITS_IND'];
      fixture.detectChanges();
      let mySpy = spyOn(component,'opened').and.callThrough(); // callThrough
      component.opened(false,0);
      expect(component.opened).toHaveBeenCalled();
      expect(mySpy).toBeDefined();
      expect(mySpy).toHaveBeenCalledTimes(1);
    }));
  });

});