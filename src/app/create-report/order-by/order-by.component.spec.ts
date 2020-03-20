import { async, 
         ComponentFixture,
         TestBed, 
         inject, 
         fakeAsync, 
         tick, 
         getTestBed 
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
  });

  describe('Simple HTML', ( ) => { 
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should get mat-card', async(async() => {
      fixture.detectChanges();
      const bannerDe: DebugElement = fixture.debugElement;
      const bannerEl: HTMLElement = bannerDe.nativeElement;
      component = fixture.componentInstance;
      await fixture.whenStable();
      fixture.detectChanges();
      expect(bannerEl.querySelector('.order-by-data').textContent.length).toEqual(56);
    }));
  });

  describe('Execute type script', ( ) => { 
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

     it('should check getSelectedTableData', fakeAsync(async() =>{
        const a = ['a', '1', 'b', '2'];
        component = fixture.componentInstance;
        spyOn(component.sharedDataService, 'getOrderbyData');
        spyOn(component.sharedDataService, 'resetQuerySeleted').and.returnValue(of('a'));
        component.sharedDataService.setSelectedTables(of(a));
        tick();
        fixture.detectChanges();
        component.sharedDataService.selectedTables.subscribe(data => expect(data).toBe(a));
        tick();
        fixture.detectChanges();
        spyOn(component, 'getColumns').and.returnValue(a);
        const b = component.getColumns(a);
        fixture.whenStable().then( () => {
          fixture.detectChanges();
          expect(b).toEqual(a, 'checking column with table');
        });
        tick();
        fixture.detectChanges();
        const initialState = component.getInitialState(a);
        const res = [{
          tableId: null,
          table: null,
          selectedColumn: null,
          columns: [],
          orderbySelected: 'ASC',
          columnDetails: JSON.parse(JSON.stringify(a)).sort()
        }];
        expect(initialState).toEqual(res);
        tick();
        fixture.detectChanges();
        const formulaCalculated = component.sharedDataService.getOrderbyData();
        expect(formulaCalculated).toEqual(undefined);
    }));

    it('should check addRow ', async() => {
      const columnWithTable = ['a', '1', 'b', '2'];
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      component.addRow();
      await fixture.whenStable();
      fixture.detectChanges();
      let n1 = component.orderbyData.length;
      expect(n1).toBe(n+1, 'checking add new row order by data');
    });

    it('should delete selected orderBy', async() => {
      component.columnWithTable = ['a', '1', 'b', '2'];
      fixture.detectChanges();
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      const n = component.orderbyData.length;
      console.log(n, 'checking n ');
      component.deleteRow(0);
      await fixture.whenStable();
      fixture.detectChanges();
      const n1 = component.orderbyData.length;
      console.log(n1,'checkn n1 length');
      expect(n1).toBe(n-1, 'checking delete new row order by data');
    });

  });

});



//selectedTables:  {
//   {
//         "tables":[
//            {
//               "view_to_admins":true,
//               "mapped_table_name":"VEHICLE_INFO",
//               "original_table_name":"VEHICLE_INFO",
//               "original_column_name":[
//                  "DELVRY_TYPE_CD_6000",
//                  "DELVRY_TYPE_CD_6200",
//                  "OPT_ENG",
//                  "OPT_TRANS_TRANSMISSION"
//               ],
//               "is_favourite":false,
//               "column_view_to_admins":[
//                  true,
//                  true,
//                  true,
//                  true,
//                  true
//               ],
//               "mapped_column_name":[
//                  "DELVRY_TYPE_CD_6000",
//                  "DELVRY_TYPE_CD_6200",
//                  "OPT_ENG",
//                  "OPT_TRANS_TRANSMISSION"
//               ],
//               "column_properties":[
//                  {
//                     "column":"DELVRY_TYPE_CD_6000",
//                     "column_view_to_admins":true,
//                     "mapped_column_name":"DELVRY_TYPE_CD_6000",
//                     "data_type":"VARCHAR2",
//                     "original_column_name":"DELVRY_TYPE_CD_6000"
//                  },
//                  {
//                     "column":"DELVRY_TYPE_CD_6200",
//                     "column_view_to_admins":true,
//                     "mapped_column_name":"DELVRY_TYPE_CD_6200",
//                     "data_type":"VARCHAR2",
//                     "original_column_name":"DELVRY_TYPE_CD_6200"
//                  }
//               ],
//               "sl_tables_id":2962,
//               "select_table_name":"VEHICLE_INFO",
//               "select_table_id":2962
//            }
//         ],
//         "custom tables":[
  
//         ],
//         "related tables":[
  
//         ]
//      },
//      "disabled":false,
//      "tableId":2962,
//      "table":{
//         "view_to_admins":true,
//         "mapped_table_name":"VEHICLE_INFO",
//         "original_table_name":"VEHICLE_INFO",
//         "original_column_name":[
//            "DELVRY_TYPE_CD_6000"         "DELVRY_TYPE_CD_6200",
//            "OPT_ENG",
//            "OPT_TRANS_TRANSMISSION",
//            "OPT_TRANS_TRN",
//            "OPT_TRANS_MTC"
//         ],
//         "is_favourite":false
//      },
//      "tableType":"Tables",
//      "columns":[
//         "ALLOC_GRP_CD"
//      ],
//      "columnAlias":{
  
//      },
//      "join":"",
//      "keys":[
//         {
//            "primaryKey":"",
//            "operation":"=",
//            "foreignKey":""
//         }
//      ],
//      "originalColumns":[
//         {
//            "column":"DELVRY_TYPE_CD_6000",
//            "column_view_to_admins":true,
//            "mapped_column_name":"DELVRY_TYPE_CD_6000",
//            "data_type":"VARCHAR2",
//            "original_column_name":"DELVRY_TYPE_CD_6000"
//         },
//         {
//            "column":"DELVRY_TYPE_CD_6200",
//            "column_view_to_admins":true,
//            "mapped_column_name":"DELVRY_TYPE_CD_6200",
//            "data_type":"VARCHAR2",
//            "original_column_name":"DELVRY_TYPE_CD_6200"
//         }
//      ]
//   }

// orderByData = [
//               {
//                 'tableId': 2962,
//                 'table': null,
//                 'selectedColumn': "T_2962.DELVRY_TYPE_CD_6000",
//                 'columns': [],
//                 'orderbySelected': "ASC",
//                 'columnDetails': ["T_2962.DELVRY_TYPE_CD_6000", "T_2962.DELVRY_TYPE"]
//                 },
//                 {
//                   'tableId': 2962,
//                   'table': null,
//                   'selectedColumn': "T_2962.DELVRY_TYPE_CD_6000",
//                   'columns': [],
//                   'orderbySelected': "ASC",
//                   'columnDetails':["T_2962.DELVRY_TYPE_CD_6000", "T_2962.DELVRY_TYPE"]
//                   }
//                 ]



class OrderByComponentMock {
   public orderbyData = [];
   public columnWithTable = [];

  public removeDeletedTableData(data){
    const selectedTables = [];
    let a = JSON.parse(JSON.stringify(selectedTables));
    for (let key in data) {
      if (!(selectedTables.find(table =>
        table['table']['select_table_id'].toString().includes(key)
      ))) {
        delete data[key];
      }
    }
  }

  // to add new row for order by data
  public addRow() {
    this.orderbyData.push({
      tableId: null,
      table: null,
      columns: [],
      selectedColumn: null,
      orderbySelected: 'ASC',
      columnDetails: JSON.parse(JSON.stringify(this.columnWithTable))
    });
  }
}
