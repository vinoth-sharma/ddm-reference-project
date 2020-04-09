import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MainMenuLandingPageComponent } from './main-menu-landing-page.component';
import { AuthenticationService } from "src/app/authentication.service";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { DjangoService } from '../../django.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { BehaviorSubject, of } from 'rxjs';
import Utils from 'src/utils';
import { Location } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('MainMenuLandingPageComponent', () => {
  let component: MainMenuLandingPageComponent;
  let fixture: ComponentFixture<MainMenuLandingPageComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainMenuLandingPageComponent, NgToasterComponent],
      providers: [{ provide: DataProviderService, useClass: DataProviderMockService },
      { provide: AuthenticationService, useClass: AuthenticationMockService },
        DataProviderService
      ],
      imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MaterialModule,
        HttpClientTestingModule, QuillModule.forRoot({}), RouterTestingModule],
    })
      .compileComponents();
  }));

  //Unit test cases written by Aneesha Biju

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuLandingPageComponent);
    component = fixture.componentInstance;
    spyOn(Utils, "showSpinner")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if text is updated', () => {
    let data = { text: "Has text been updated" };
    component.textChanged(data);
    expect(component.textChange).toBeTruthy();
    expect(component.enableUpdateData).toBeTruthy();
  });

  it('edit_True() set edit true', () => {
    component.original_content = "data";
    component.edit_True();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.naming).toEqual("data");
  });

  it('editEnable() should enable to edit', () => {
    component.original_content = "original data";
    component.editEnable();
    expect(component.editModes).toBeTruthy();
    expect(component.readOnlyContentHelper).toBeFalsy();
    expect(component.naming).toEqual("original data");
  });

  it("saveChanges() should save data in server when save button is clicked", fakeAsync(() => {
    let toastr = TestBed.inject(NgToasterComponent);
    expect(component.newContent).toBeFalsy();
    let djangoService = TestBed.inject(DjangoService);
    let spy = spyOn(djangoService, "ddm_rmp_main_menu_description_text_post").and.returnValue(of({ data: { key: "value" } }))
    spyOn(component, 'ngOnInit');
    let toastrSpy = spyOn(toastr, "success");
    component.newContent = true;
    component.main_menu_content = []
    component.saveChanges();
    tick();
    expect(component.main_menu_content[0]["ddm_rmp_main_menu_description_text_id"]).toEqual({ key: "value" });
    expect(spy).toHaveBeenCalled();
    expect(toastrSpy).toHaveBeenCalled();
  }))

  it('form invalid when empty', () => {
    expect(component.contentForm.valid).toBeFalsy();
  });

  it('required fields of contentForm validity', () => {
    let errors = {};
    let question = component.contentForm.controls['question'];
    let answer = component.contentForm.controls['answer'];
    errors = question.errors || answer.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it("should delete an element when called with id", fakeAsync(() => {
    let djangoService = TestBed.get(DjangoService);
    let toastr = TestBed.get(NgToasterComponent);
    let tosterSpy = spyOn(toastr, "success")
    let djangoSpy = spyOn(djangoService, "ddm_rmp_main_menu_description_text_delete").and.returnValue(of({}));
    component.active_content_id = 12;
    component.main_menu_content = [{ ddm_rmp_main_menu_description_text_id: 12, question: "ABC?", answer: "Ans", link_title_url: { title: "a", link: "hi" } }]
    component.delete_confirmation();
    tick();
    expect(tosterSpy).toHaveBeenCalled();
    expect(djangoSpy).toHaveBeenCalled();
  }))

  it("should edit an element", fakeAsync(() => {
    expect(component.newContent).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    component.naming = "abc"
    component.description_text['description'] = component.naming;
    expect(component.description_text['description']).toEqual("abc");
    let djangoService = TestBed.get(DjangoService);
    let toastr = TestBed.get(NgToasterComponent);
    let tosterSpy = spyOn(toastr, "success");
    let dataProviderService = TestBed.get(DataProviderService);
    let lookUpTableData = { data: { desc_text_admin_documents: [{ key: "lookUpData" }] } }
    spyOn(djangoService, "ddm_rmp_landing_page_desc_text_put").and.returnValue(of([{ ddm_rmp_desc_text_id: 4, temp_desc_text: "abc" }]));
    spyOn(dataProviderService, "changelookUpTableData").and.returnValue(of(lookUpTableData));
    spyOn(Utils, "hideSpinner");
    tick();
    component.content_edits();
    dataProviderService.changelookUpTableData();
    expect(component.editModes).toBeFalsy();
    spyOn(component, 'ngOnInit');
    component.original_content = component.naming;
    expect(component.original_content).toEqual("abc");
    expect(tosterSpy).toHaveBeenCalled();
    expect(djangoService.changelookUpTableData).toHaveBeenCalled();
  }))

  it('addLinkTitleURL() form invalid when empty', () => {
    expect(component.LinkTitleURL.valid).toBeTruthy();
    let errors = {};
    let title = component.contentForm.controls['question'];
    let link = component.contentForm.controls['answer'];
    errors = title.errors || link.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('route_url() should navigate to "search" takes you to /search', fakeAsync(() => {
    router.navigate(["/search"]).then(() => {
      expect(location.path()).toBe("/search");
    });
  }));
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
