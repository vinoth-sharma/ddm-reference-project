import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContainerComponent } from './table-container.component';
import { MaterialModule } from "../../../../material.module";
import { CustomPipeModules } from "../../../../custom-directives/custom.pipes.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from "ngx-toastr";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


fdescribe('TableContainerComponent', () => {
  let component: TableContainerComponent;
  let fixture: ComponentFixture<TableContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContainerComponent ],
      imports : [ MaterialModule,CustomPipeModules ,HttpClientTestingModule,NoopAnimationsModule],
      providers: [
        { provide: ToastrService, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContainerComponent);
    component = fixture.componentInstance;
    component.sheetData = {
      tabs : [{tab_type: "table"} ]
    }
    component.customziedData = {
      data : {
        isCustomized : false
      }
    }
    fixture.detectChanges();
  });

  it('should create Table Container Component', () => {
    expect(component).toBeTruthy();
  });

  it('Test DateFormatter function', () => {
    let date = new Date();
    let l_date = date.getDate();
    let l_year = date.getFullYear();
    let l_month = date.toLocaleDateString("en-US",{month: 'short'})
    let l_response = l_date + "-" + l_month + "-" + l_year;
    expect(component.dateFormattor(new Date())).toEqual(l_response);
  });

  it('Test getOriginalColumnName function', () => {
    component.customziedData = {
      data : {
        isCustomized : false
      }
    }
    expect(component.getOriginalColumnName("column1")).toEqual("column1");
  });


});
