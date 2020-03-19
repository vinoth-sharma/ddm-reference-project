import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectComponent } from './multi-select.component';
import { MaterialModule } from "../../material.module";
import { CustomPipeModules } from "../custom.pipes.module";

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectComponent ] ,
      imports : [MaterialModule , CustomPipeModules]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    component.data = ["data1","data2"];
    component.index = 1;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing - GetTitle function', () => {
    expect(component.getTitle(["sample_dummy_1"])).toBeTruthy(["sample 1"]);
  });


  // it('Testing - closeDropDown function', () => {
  //   component.data = ["data1","data2"];
  //   component.index = 1;
  //   component.columnsUpdated();
  //   component.updatedChecked();
  //   component.closeDropDown();

  //   expect(component.hideMenu).toEqual(false);
  // });

  it('Testing - updateSelectedValues function', () => {
    component.data = ["data1","data2"];
    component.index = 1;
    let obj = [];
    obj['data1'] = { checked : true } 
    obj['data2']= { checked : false }
    component.optionsMap = obj;
    // component.columnsUpdated();
    // component.updatedChecked();
    component.updateSelectedValues();

    expect(component.selectedValues).toEqual(["data1"]);
  });

  
  it('Testing - selectClicked function', () => {
    let obj = {
      clientX : 12 , clientY :12 ,layerY:  20 ,layerX :20 
    }
    component.data = ["data1","data2"];
    component.index = 12;
    let obj1 = [];
    obj['data1'] = { checked : true } 
    obj['data2']= { checked : false }
    component.optionsMap = obj1;
    component.selectClicked(obj);
    expect(component.hideMenu).toEqual(true);
  });

  
  


});
