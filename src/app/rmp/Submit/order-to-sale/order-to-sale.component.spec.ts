import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { AuthenticationService } from "src/app/authentication.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { OrderToSaleComponent } from './order-to-sale.component';
import { CustomPipeModules } from "../../../custom-directives/custom.pipes.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DjangoService } from 'src/app/rmp/django.service';
import { QuillModule } from 'ngx-quill';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from "../../../material.module";
import { DatePipe } from '@angular/common'
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Utils from "../../../../utils";

describe('OrderToSaleComponent', () => {
  let component: OrderToSaleComponent;
  let fixture: ComponentFixture<OrderToSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderToSaleComponent],
      providers: [AuthenticationService, GeneratedReportService, DataProviderService, DjangoService, DatePipe],
      imports: [CustomPipeModules, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, QuillModule.forRoot(),
        AngularMultiSelectModule, MaterialModule,NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderToSaleComponent);
    component = fixture.componentInstance;   
   
    let providerService = TestBed.inject(DataProviderService);
    
    spyOn(component.dataProvider,"currentlookUpTableData").and.returnValue(of(currentlookUpTableData))
   
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('textChanged function', () => {
    component.textChanged({text: "sd "});
    expect(component.enableUpdateData).toBe(true);
    component.textChanged({text: "  "});
    expect(component.enableUpdateData).toBe(false);
  });

  it('content_edits function', () => {
    component.textChanged({text: "sd "});
    component.namings = "dummy";
    spyOn(Utils,"showSpinner")
    spyOn(Utils,"hideSpinner")
    component.content_edits();
    expect(component.readOnlyContentHelper).toBe(true)
    expect(component.editModes).toBe(false)
    expect(component.description_text.description).toBe("dummy")
  });

  it("edit_True function",()=>{
    component.original_content = "original"
    component.edit_True();
    expect(component.editModes).toBe(false)
    expect(component.readOnlyContentHelper).toBe(true)
    expect(component.namings).toBe("original")
  })

  it("editEnable function",()=>{
    component.original_content = "original"
    component.editEnable();
    expect(component.editModes).toBe(true)
    expect(component.readOnlyContentHelper).toBe(false)
    expect(component.namings).toBe("original")
  })

  it("vehicleItemSelect function",()=>{
    component.vehicleIndex = [];
    component.selectedItemsVehicleLine = selectedVehicleLineData;
    component.vehicleItemSelect({});
    expect(component.vehicleIndex.length).toBe(2);
  })

  it("vehicleItemDeSelect function",()=>{
    component.vehicleIndex = [];
    component.selectedItemsVehicleLine = selectedVehicleLineData;
    component.vehicleItemSelect({});
    component.vehicleItemDeSelect({ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 1});
    expect(component.vehicleIndex.length).toBe(1);
  })
  
  
  it("vehicleSelectAll function",()=>{
    component.vehicleIndex = [];
    component.vehicleSelectAll([1,2]);
    expect(component.vehicleIndex.length).toBe(2);
  })

  it("vehicleDeSelectAll function",()=>{
    component.vehicleDeSelectAll([]);
    expect(component.vehicleIndex.length).toBe(0);
  })

  it("vehicleSelection function",()=>{
    component.selectedItemsVehicleLine = selectedVehicleLineData;
    component.allo = dummy_data;
    component.merchandize = dummy_data;
    component.vehicleIndex = [1,2]
    component.selectedItemsAllocation = [{ddm_rmp_lookup_dropdown_allocation_group_id:1}]
    component.vehicleSelection(null);
    expect(component.allocationFinalList.length).toBe(1);
    expect(component.merchandizeFinalList.length).toBe(1);
    expect(component.allocationIndex.length).toBe(1)
  })

  it("vehicleDeSelection function",()=>{
    component.vehicleIndex = [1,2];
    component.vehicleDeSelection(null);
    component.merchandizeItemsSelect = [{ddm_rmp_lookup_dropdown_allocation_group_id:1}];
    component.selectedItemsAllocation = [{ddm_rmp_lookup_dropdown_allocation_group_id:1},{ddm_rmp_lookup_dropdown_allocation_group_id:2}];
    expect(component.selectedItemsAllocation.length).toBe(2);
    expect(component.merchandizeItemsSelect.length).toBe(1);
  
  });

  it("allocationItemsSelect function",()=>{
    component.selectedItemsAllocation = [{ddm_rmp_lookup_dropdown_allocation_group_id:1}];
    component.allocationItemsSelect(null);
    expect(component.allocationIndex.length).toBe(1);
  });


  it("allocationItemDeSelect function",()=>{
    component.allocationIndex = [1,2];
    component.selectedItemsAllocation = [{ddm_rmp_lookup_dropdown_allocation_group_id:1}];
    component.allocationItemDeSelect({ddm_rmp_lookup_dropdown_allocation_group_id:1});
    expect(component.allocationIndex.length).toBe(1);
  });

  it("allocationSelectAll function",()=>{
    component.allocationIndex = [];
    component.allocationSelectAll([1,2]);
    expect(component.allocationIndex.length).toBe(2);
  })

  it("allocationDeSelectAll function",()=>{
    component.allocationDeSelectAll([]);
    expect(component.allocationIndex.length).toBe(0);
  })

  it("allocationSelection function",()=>{
    component.merchandize = [{ddm_rmp_lookup_dropdown_allocation_group:1}];
    component.allocationIndex = [1,2]
    component.selectedItemsAllocation = [{ddm_rmp_lookup_dropdown_allocation_group_id:1}]
    component.allocationSelection(null);
    expect(component.merchandizeFinalList.length).toBe(1);
  })

  it("allocationDeSelection function",()=>{
    component.allocationIndex = [1,2];
    component.allocationDeSelection(null);
    component.merchandizeItemsSelect = [{ddm_rmp_lookup_dropdown_allocation_group:1}];
    expect(component.merchandizeItemsSelect.length).toBe(1);
  });

  it("distributionEntityRadio function",()=>{

    component.distributionEntityRadio(null,{type_data_desc:"desc",ddm_rmp_lookup_ots_type_data_id:1},{target:{id:"1",value:"dummy"}})
    expect(component.distributionRadio).toBe("dummy")
    console.log(component.distributionEntityCheckbox);
    expect(component.distributionEntityCheckbox).toEqual(jasmine.objectContaining({value: "desc",
    id: 1,
    radio: "dummy"}))
  })

  it("desc function",()=>{
    component.desc("test");
    expect(component.textData).toBe("test")
  })

  it("CheckboxCheck function",()=>{
    component.CheckboxCheck({ddm_rmp_lookup_ots_checkbox_values_id:1,field_values:"value"},{target:{checked: true}});
    expect(component.targetProd).toBe(true)
  })

  // it("selectionChanged function",()=>{
  //   component.selectionChanged("test");
  //   expect(component.textData).toBe("test")
  // })

});


const currentlookUpTableData = {
  message: "success",
  data: {
    checkbox_data: [{
      ddm_rmp_ots_checkbox_group_id: 1,
      checkbox_desc: "Commonly Requested Fields Available for Display",
      ddm_rmp_lookup_ots_checkbox_values_id: 1,
      field_values: "Order Number",
      description: false,
      tooltip: null
    }, {
      ddm_rmp_ots_checkbox_group_id: 1,
      checkbox_desc: "Commonly Requested Fields Available for Display",
      ddm_rmp_lookup_ots_checkbox_values_id: 2,
      field_values: "Vehicle Information Number (VIN)",
      description: false,
      tooltip: null
      }],
    type_data: [{ddm_rmp_lookup_ots_type_data_id: 1,
      type_data_desc: "Retail Only"}],
      cycle_data_da: [{ddm_rmp_lookup_cycle_id: 1,
        cycle_desc: "Cycle1"}],
    
  }
}

const selectedVehicleLineData = [{ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 1},
                                  {ddm_rmp_lookup_dropdown_vehicle_line_brand_id: 2}]

const dummy_data = [{ddm_rmp_lookup_dropdown_vehicle_line_brand: 1}]