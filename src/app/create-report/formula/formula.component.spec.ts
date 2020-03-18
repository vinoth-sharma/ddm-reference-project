import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormulaComponent } from './formula.component';
import { MaterialModule } from "../../material.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomPipeModules } from "../../custom-directives/custom.pipes.module";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { GenerateReportModalComponent } from "../generate-report-modal/generate-report-modal.component";
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from "@angular/router";
import { FormulaService } from "./formula.service";
import { SharedDataService } from "../shared-data.service";
import Utils from "../../../utils";

fdescribe('FormulaComponent', () => {
  let component: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaComponent ,GenerateReportModalComponent ],
      imports: [MaterialModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CustomPipeModules, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute,  useValue: {
          queryParams : of({
            get: () => {
            return 10;
            }
          })
          }},FormulaService,SharedDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaComponent);
    component = fixture.componentInstance;
    component.selectedTables = sampleSelectedTables;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("test preview route func",()=>{
    spyOn(component.onView, 'emit');
    component.formulaTextarea = "sample"

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('#preview-btn');

    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.onView.emit).toHaveBeenCalledWith(jasmine.objectContaining({ formula : "sample"}));
  })

  it('getColumns function', () => {
    // component.selectedTables = [{columns : [ "column1" , "column2"]}]
    expect(component.getColumns()).toEqual(["column1" , "column2","column3" , "column4"]);
  });


  it('getTableIds function', () => {
    // component.selectedTables = [{columns : [ "column1" , "column2"]}]
    expect(component.getTableIds()).toEqual(jasmine.objectContaining({ 
      table_ids : [121],
      custom_ids : [12]
    }));
  });

  it('isNewReport function', () => {
    expect(component.isNewReport()).toEqual(true);
  });

  it('getListId function', () => {
    expect(component.getListId()).toEqual(0);
  });

  it('getSheetId function', () => {
    expect(component.getSheetId()).toEqual(0);
  });

  it('getAllData function', () => {
    // component.sharedDataService.setEditRequestId(true);
    let obj = {
      selected_tables: component.getUpdatedTables(),
      calculated_fields: [],
      aggregations : { data : [] ,aggregation : ""},
      having: "",
      orderBy : {},
      condition : { data : {}},
      formula_fields : undefined,
      request_id: undefined
    }
    expect(component.getAllData()).toEqual(jasmine.objectContaining(obj));
  });

  it('getRequestId function', () => {
    // component.sharedDataService.setEditRequestId(true);
    expect(component.getRequestId()).toEqual(undefined);
  });

  it('getUpdatedTables function', () => {
    expect(component.getUpdatedTables()[0]).toEqual(jasmine.objectContaining({tableType : "Custom Tables" , tableId : 12 ,columns : [ "column1" , "column2"]}));
  });

  // it("createNewSheet func",()=>{
  //   let formulaService = TestBed.inject(FormulaService);
  //   let sharedService = TestBed.inject(SharedDataService);
  //   spyOn(formulaService, "createSheetToExistingReport").and.returnValue(of({data:[],status:200}));
  //   spyOn(Utils,"showSpinner");
  //   component.createNewSheet({report_name:"report1",sheet_name:"sheet"});
  //   tick();
  //   console.log(sharedService.getReportConditionFlag());
  // })
});

var sampleSelectedTables = [{tableType : "Custom Tables" , tableId : 12 ,columns : [ "column1" , "column2"],table: ["table"] },{tableType : "Tables" , tableId : 121 ,columns : [ "column3" , "column4"],table: ["table"] }]
  

export class ActivatedRouteStub {

  //Observable that contains a map of the parameters
  private subjectParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.subjectParamMap.asObservable();

  private _testParamMap: ParamMap;
  get testParamMap() {
      return this._testParamMap;
  }
  set testParamMap(params: {}) {
      this._testParamMap = convertToParamMap(params);
      this.subjectParamMap.next(this._testParamMap);
  }

  //Observable that contains a map of the query parameters
  private subjectQueryParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
  queryParamMap = this.subjectQueryParamMap.asObservable();

  private _testQueryParamMap: ParamMap;
  get testQueryParamMap() {
      return this._testQueryParamMap;
  }
  set testQueryParamMap(params: {}) {
      this._testQueryParamMap = convertToParamMap(params);
      this.subjectQueryParamMap.next(this._testQueryParamMap);
  }

  get snapshot() {
      return {
          paramMap: this.testParamMap,
          queryParamMap: this.testQueryParamMap
      }
  }

}
