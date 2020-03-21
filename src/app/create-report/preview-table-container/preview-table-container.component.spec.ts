import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { PreviewTableContainerComponent } from './preview-table-container.component';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { spaceFormaterString } from 'src/app/custom-directives/spaceFormaterString.pipe';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from "../../../environments/environment";


describe('PreviewTableContainerComponent', () => {
  let component: PreviewTableContainerComponent;
  let fixture: ComponentFixture<PreviewTableContainerComponent>;
  let data = {data:"data"}
  let serverData = {
    data:{
      list:[{NAMEPLT_CD: "001",
      NAMEPLT_DESC: "Chevrolet"},{ORDER_NUM: "XJPX16",
      SELL_SRC_CD: "23",
      ALLOC_GRP_CD: "BEAT5",
      MODEL_YR_NUM: "2020",
      ORDER_THRU_BAC: 122101,
      ORDER_THRU_BFC: 1,
      CHRG_BUSNS_ASCT_CD: 122101,
      CHRG_BUSNS_FCN_CD: 1,
      VIN: null,
      CUR_VEH_EVNT_CD: "1100",
      ORDERED_DT: new Date(1992,3,3)}],number:1,per_page:251,sql_columns:["NAMEPLT_CD","NAMEPLT_DESC"],total_row_count:24,column_properties:[{mapped_column: "NAMEPLT_DESC",
      original_column: "NAMEPLT_DESC",
      column_data_type: "VARCHAR2"},{
        mapped_column: "ORDERED_DT",
        original_column: "ORDERED_DT",
        column_data_type: "DATE",
      }],column_order:{1: "NAMEPLT_CD",
      2: "NAMEPLT_DESC"}
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTableContainerComponent ,spaceFormaterString],
      imports:[MaterialModule,HttpClientTestingModule,BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data from server',async(()=>{
    spyOn(component,"getData").and.returnValue(of(serverData));
    component.getPaginationData();
    fixture.whenStable().then(()=>{
      expect(component.data).toBe(serverData.data.list)
    })
  }))

  it ("should set a few properties of the component",()=>{
    component.dataTransformation(serverData);
    let spy = spyOn(component,'doDateFormatting');
    expect(component.displayedColumns).toEqual(Object.keys(serverData.data.list[0]));
    expect(component.resultsLength).toEqual(serverData.data.total_row_count);
    expect(component.l_columnProps).toEqual(serverData.data.column_properties);
    expect(component.data).toEqual(serverData.data.list);
    expect(component.isLoadingResults).toBeFalsy()  
  })

  it("should format the date",()=>{
    component.data = serverData.data.list
    component.l_columnProps = serverData.data.column_properties;
    component.doDateFormatting();
    console.log("component data",component.data)
    expect(component.data[1].ORDERED_DT).toEqual('3-Apr-1992')
  })

  it("should return a date in dd-mon-yyyy format",()=>{
   expect(component.dateFormattor(new Date(1992,3,3))).toEqual('3-Apr-1992')
  })

  it('should get report data from the server',async(()=>{
    component.reqData = {sl_id:"1",query:"d"};
    component.reqData.sl_id = 1;
    component.reqData.query =  "ss";
    let injector = getTestBed();
    let httpMock = injector.inject(HttpTestingController);
    component.getData(1,2).subscribe(res =>{
      expect(res).toEqual(data)
    })
    let serviceUrl = `${environment.baseUrl}semantic_layer/execute_custom_query/`;
    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should call error handler',async(()=>{
    let errorData = {error:"404 Not Found",status:"Failure"}
    let errObj: any = {
      status: errorData.status,
      message: errorData.error
    };
   expect(function(){component.handleError(errorData)}).toThrow(errObj)
  }))
});
