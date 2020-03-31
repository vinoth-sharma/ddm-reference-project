import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuillModule } from 'ngx-quill';
import { DealerAllocationComponent } from './dealer-allocation.component';
import { DjangoService } from '../../django.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DataProviderService } from '../../data-provider.service';
import Utils from 'src/utils';
import { of, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { GeneratedReportService } from '../../generated-report.service';

describe('DealerAllocationComponent', () => {
  let component: DealerAllocationComponent;
  let fixture: ComponentFixture<DealerAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerAllocationComponent, NgToasterComponent],
      providers: [DatePipe, { provide: DataProviderService, useClass: DataProviderMockService },
        { provide: AuthenticationService, useClass: AuthenticationMockService }],
        imports: [HttpClientTestingModule,FormsModule,QuillModule.forRoot({}),RouterTestingModule, MaterialModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(Utils,"showSpinner");
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('content_edits() should edit the content of the Help icon', fakeAsync(() => {
      let toastr = TestBed.inject(NgToasterComponent);
      let djangoService = TestBed.inject(DjangoService);
      let dataService = TestBed.inject(DataProviderService);
      spyOn(djangoService, "ddm_rmp_landing_page_desc_text_put").and.returnValue(of("abc"));
      spyOn(component, 'ngOnInit');      
      let dataServiceSpy = spyOn(dataService, "changelookUpTableData");
      let toastrSpy = spyOn(toastr, "success");
      component.textChange = false;
      component.lookup = { data: { desc_text: [{ ddm_rmp_desc_text_id: 1, module_name: "What is DDM", description: "" }] } }
      component.description_text = { description: "description", module_name: "", ddm_rmp_desc_text_id: 1 }
      component.namings = "description";
      component.content_edits();
      expect(component.editModes).toBeFalsy();
      expect(component.readOnlyContentHelper).toBeTruthy();
      // expect(component.lookup.data.desc_text[1]).toEqual("givenName");
      expect(dataServiceSpy).toHaveBeenCalled();
      expect(component.original_content).toEqual("description");
      expect(toastrSpy).toHaveBeenCalled();
    })
  );

  it('changeReportMessage() should set changeButtonStatus true', () => {
    let service = TestBed.inject(GeneratedReportService);
    component.changeReportMessage();
    expect(component.report_message).toBeNull;   
    expect(service.changeButtonStatus).toBeTruthy; 
  });

  it('Calling changeReportMessage() should navigate to user/request-status', async(() => {
    let component = fixture.componentInstance;
    let router = TestBed.inject(Router);
    let navigateSpy = spyOn(router, 'navigate');
    component.changeReportMessage();
    expect(navigateSpy).toHaveBeenCalledWith(['user/request-status']);
  }));

  it('printDiv() should navigate to user/request-status', async(() => {
    let component = fixture.componentInstance;
    component.printDiv(); 
  }));

  // printDiv() {
  //   this.restorepage = document.body.innerHTML;
  //   this.printcontent = document.getElementById('editable').innerHTML;
  //   document.body.innerHTML = this.printcontent;
  //   window.print();
  //   document.body.innerHTML = this.restorepage;
  //   location.reload(true);
  // }
  

  it('textChanged() should check if text is updated', () => {
    let data = {text: "Has text been updated"};
    component.textChanged(data);
    expect(component.textChange).toBeTruthy();      
    expect(component.enableUpdateData).toBeTruthy();
  });

  it('edit_True() set edit true', () => {
    component.original_content = "data";
    component.edit_True();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();    
    expect(component.namings).toEqual("data");
  });

  it('editEnable() should enable to edit', () => {
    component.original_content = "original data";
    component.editEnable();
    expect(component.editModes).toBeTruthy();
    expect(component.readOnlyContentHelper).toBeFalsy();    
    expect(component.namings).toEqual("original data");
  });

  class AuthenticationMockService {
    public myMethodSubject = new BehaviorSubject<any>("");
    public myMethod$ = this.myMethodSubject.asObservable();

    myMethod(data, dummyOne, dummyTwo) {
      this.myMethodSubject.next(data)
    }
    getHelpRedirection(value: string) {
    }
    constructor() {
      let userData = { role: "predefined_role", first_name: "predefined_firstName", last_name: "predefined_last_name" };
    }
  }

  class DataProviderMockService {
    private FileData = new BehaviorSubject<object>(null);
    currentFiles = this.FileData.asObservable();
    private lookUpData = new BehaviorSubject<object>(null);
    private lookUpTableData = new BehaviorSubject<object>(null);
    currentlookupData = this.lookUpData.asObservable();
    currentlookUpTableData = this.lookUpTableData.asObservable();

    constructor() {
      let lookUpTableData = {}
    }
    changeFiles(files) {
      this.FileData.next(files)
    }
    changelookUpTableData(message: object) {
      this.lookUpTableData.next(message)
    }
  }
});
