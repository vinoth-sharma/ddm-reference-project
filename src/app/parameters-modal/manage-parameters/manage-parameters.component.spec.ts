import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from "../../material.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ManageParametersComponent } from './manage-parameters.component';
import { CustomPipeModules } from "../../custom-directives/custom.pipes.module";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ParametersService } from "../parameters.service";
import { of } from 'rxjs';

describe('ManageParametersComponent', () => {
  let component: ManageParametersComponent;
  let fixture: ComponentFixture<ManageParametersComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageParametersComponent],
      providers: [ParametersService],
      imports: [MaterialModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CustomPipeModules, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageParametersComponent);
    component = fixture.componentInstance;
    component.data = sampleData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Table selection is done', () => {
    component.onSelectionChanged(tableSelection);
    expect(component.tableData.id).toEqual(309);
  });

  it("get parameters func", () => {
    let paramService = TestBed.inject(ParametersService);
    spyOn(paramService, "getExistingParametersTables").and.returnValue(of(paramList_response));
    component.tableData.group = "Tables";
    component.getAllParameters(309);
    // expect(component.dataLoading).toEqual(true);
    expect(component.parametersList.length).toEqual(paramList_response.data.length);
    expect(component.dataLoading).toEqual(false);
  })

  it("show confirmation dialog",()=>{
    component.showConfirmationDilaog({"sl_parameters_id":1});
    expect(component.enableDeleteConfirmationDialog).toEqual(true);
    expect(component.selectedParameterToDel).toEqual(1);
  })

  it("delete parameter",()=>{
    let paramService = TestBed.inject(ParametersService);
    spyOn(paramService, "deleteParameter").and.returnValue(of({status:200}));
    component.deleteParameter();
    expect(component.enableDeleteConfirmationDialog).toEqual(false);
    expect(component.selectedParameterToDel).toEqual(null);
  })

});

var sampleData = {
  "semanticId": 1,
  "tableData": [
    {
      "sl_tables_id": 308,
      "is_favourite": false,
      "mapped_table_name": "ALLOC_ESTIM_dummy_meeeee_dummy_vb_dummy_c",
    },
    {
      "sl_tables_id": 309,
      "is_favourite": false,
      "mapped_table_name": "HJ",
    }],

  "customTable": [
    {
      "custom_table_name": "as",
      "custom_table_id": 1,
    },
    {
      "custom_table_name": "as1",
      "custom_table_id": 71,
    }]
}

var tableSelection = {
  option: {
    group: {
      label: 'Tables'
    },
    value: "HJ"
  }
}

var paramList_response = {
  data: [{
    sl_parameters_id: 6,
    parameter_name: "nm",
    sl_tables_id: 309,
    column_used: "AVG_SALES_QTY",
    parameter_formula: ["'123'"],
    description: "desc",
    is_custom: false
  }],
  status: 200
}