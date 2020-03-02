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
    fixture.detectChanges();
  });

  it('should create Table Container Component', () => {
    expect(component).toBeTruthy();
  });

  it('Test DateFormatter function', () => {
    expect(component.dateFormattor(new Date())).toEqual("2-Mar-2020");
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
