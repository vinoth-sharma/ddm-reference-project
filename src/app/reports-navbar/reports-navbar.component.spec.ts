import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsNavbarComponent } from './reports-navbar.component';
import { SemanticReportsService } from '../semantic-reports/semantic-reports.service';
import { of } from 'rxjs';
import { MaterialModule } from '../material.module';
import { CustomPipeModules } from '../custom-directives/custom.pipes.module';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { element } from 'protractor';
import { Component } from '@angular/core';

describe('ReportsNavbarComponent', () => {
  let template ;
  let component: ReportsNavbarComponent;
  let fixture: ComponentFixture<ReportsNavbarComponent>;
  let testHostFixture : ComponentFixture<MockParent>
  let testHostComponent : MockParent;
  let queryData = {
        queries:[
        {
          query: "SELECT A_DID_0.AVAVAVAV_ARARARART_NJNJNJN_LKJH_AFAFA  FROM VSMDDM.DID_SUMMARY A_DID_0    GROUP BY A_DID_0.AVAVAVAV_ARARARART_NJNJNJN_LKJH_AFAFA",
          sheet_name: "Sheet_1"
        }
      ]
    }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsNavbarComponent,MockParent ],
      imports:[MaterialModule,CustomPipeModules,CommonModule,HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    template = fixture.debugElement.nativeElement;
 
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get query from the server and show it in modal',async(()=>{
    let service = fixture.debugElement.injector.get(SemanticReportsService);
    let spy = spyOn(service,'getReportQuery').and.returnValue(of(queryData));
    component.isLoading = false;
    component.getQuery();
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
    expect(component.query).toEqual(queryData.queries);
    expect(template.querySelector('#text > div > b').textContent).toEqual('SHEET_1:');
    expect(template.querySelector('#text > div > p').textContent).toEqual(component.query[0].query)
    })

  }))

  it('should download the query when clicked on download button',()=>{
    component.query = [
      {
        query: "SELECT A_DID_0.AVAVAVAV_ARARARART_NJNJNJN_LKJH_AFAFA  FROM VSMDDM.DID_SUMMARY A_DID_0    GROUP BY A_DID_0.AVAVAVAV_ARARARART_NJNJNJN_LKJH_AFAFA",
        sheet_name: "Sheet_1"
      }
    ];
    let spy = spyOn(component,'downloadQuery');
    component.isLoading = false;
    fixture.detectChanges();
    template.querySelector('#downloadQuery').click();
    expect(spy).toHaveBeenCalled();
  })

  it('should read input @confirmHeader from parent and render it a template', () => {
    testHostFixture = TestBed.createComponent(MockParent);
    testHostComponent = testHostFixture.debugElement.componentInstance;
    testHostFixture.detectChanges();
    let hostelement = <HTMLElement>testHostFixture.debugElement.nativeElement;
    expect(hostelement.querySelector(".modal-title").textContent).toContain('reportName');
  });

  @Component({
    selector:'mock-parent',
    template:`<app-reports-navbar selReportId="1"  selReportName="reportName"></app-reports-navbar>`
  })
  class MockParent {
    triggerOutPutEvent(){
    }
  }

});



