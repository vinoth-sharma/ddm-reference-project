// author : Bharath
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DdmAdminComponent } from './ddm-admin.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataProviderService } from '../../data-provider.service';
import { BehaviorSubject, of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';
import { DjangoService } from '../../django.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';

describe('DdmAdminComponent', () => {
  let component: DdmAdminComponent;
  let fixture: ComponentFixture<DdmAdminComponent>;
  let dataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DdmAdminComponent],
      providers: [{ provide: DataProviderService, useClass: DataProviderMockMockService },
      { provide: AuthenticationService, useClass: AuthenticationMockMockService }
      ],
      imports: [FormsModule, QuillModule.forRoot({}), MaterialModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmAdminComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataProviderService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should read current files from data service", async(() => {
    let files = { list: [{ key: "key" }], flag: "is_admin" }
    component.getCurrentFiles();
    dataService.changeFiles(files);
    expect(component.filesList).toBe(files.list)
  }))

  it("should read lookup table data from data service", async(() => {
    let lookuptabledata = { list: [{ key: "key" }], flag: "is_admin" }
    component.getCurrentTableLookupData();
    dataService.changelookUpTableData(lookuptabledata);
    expect(component.content).toBe(lookuptabledata)
  }))

  it("should read user details from auth service", async(() => {
    let userData = { role: "admin" }
    component.getUserInfo();
    let authSevice = TestBed.inject(AuthenticationService)
    authSevice.myMethod(userData, null, null);
    expect(component.user_role).toBe(userData.role)
  }))


  it("should read links from django service", async(() => {
    let djangoService = TestBed.inject(DjangoService);
    let data = { data: { url: "url" } }
    spyOn(djangoService, 'get_doc_link').and.returnValue(of(data));
    let spy = spyOn(window, "open");
    component.getLink(1);
    expect(spy).toHaveBeenCalledWith(data.data.url, "_blank")
  }))

  it("should set properties of the comp 1", () => {
    component.original_content = "original_content";
    component.edit_True();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.namings).toBe("original_content");

  })

  it("should set properties of the comp  2", () => {
    component.original_content = "original_content";
    component.editEnable();
    expect(component.editModes).toBeTruthy();
    expect(component.readOnlyContentHelper).toBeFalsy();
    expect(component.namings).toBe("original_content");

  })

  it("should set properties of the comp  3", () => {
    component.content_edit();
    expect(component.editMode).toBeFalsy();
  })

  it("should set properties of the comp  4", () => {
    component.editMode = true
    component.editTrue();
    expect(component.editMode).toBeFalsy();
  })

  it("should clear the input values", () => {
    let element = fixture.debugElement.nativeElement;
    component.content = true;
    spyOn(component, "ngOnInit")
    fixture.detectChanges()

    element.querySelector('#document-name').value = "abc"
    fixture.detectChanges()
    component.NewDoc()
    expect(component.editid).toBe(undefined);
    expect(element.querySelector('#document-name').value).toEqual("")
  })

  it("should set properties of the comp 5", () => {
    let element = fixture.debugElement.nativeElement;
    component.content = true;
    spyOn(component, "ngOnInit")
    fixture.detectChanges();
    element.querySelector("#uploadCheckbox").checked = true;
    component.upload("");
    expect(element.querySelector("#document-url").disabled).toEqual(true);
    expect(element.querySelector("#attach-file1").disabled).toEqual(false)
  })

  it("should set properties of the comp 6", () => {
    let element = fixture.debugElement.nativeElement;
    component.content = true;
    spyOn(component, "ngOnInit")
    fixture.detectChanges();
    element.querySelector("#uploadCheckbox").checked = false;
    component.upload("");
    expect(element.querySelector("#document-url").disabled).toEqual(false);
    expect(element.querySelector("#attach-file1").disabled).toEqual(true)
    expect(element.querySelector("#attach-file1").value).toEqual("")
  })

  it("should push data to to server when clicked on save button and update component properties", () => {
    let element = fixture.debugElement.nativeElement;
    let toastr = TestBed.inject(NgToasterComponent)
    let djangoService = TestBed.inject(DjangoService);
    spyOn(djangoService, "ddm_rmp_landing_page_desc_text_put").and.returnValue(of("abc"))
    spyOn(component, 'ngOnInit');
    let dataServiceSpy = spyOn(dataService, "changelookUpTableData");
    let toastrSpy = spyOn(toastr, "success")
    component.textChange = false;
    component.content = { data: { desc_text: [{ ddm_rmp_desc_text_id: 1, module_name: "What is DDM", description: "nan" }, { ddm_rmp_desc_text_id: 9, module_name: "Help_DDMAdmin", description: "<p>nan vvvv</p>" }] } }
    component.description_text = { description: "", module_name: "", ddm_rmp_desc_text_id: 1 }
    component.namings = "namings"
    component.content_edits();
    expect(component.editModes).toBeFalsy();
    expect(component.readOnlyContentHelper).toBeTruthy();
    expect(component.description_text.description).toEqual("namings");
    expect(component.content.data.desc_text[1]).toEqual(component.description_text);
    expect(dataServiceSpy).toHaveBeenCalled();
    expect(component.original_content).toEqual("namings");
    expect(toastrSpy).toHaveBeenCalled();
  })

  it("should set these properties of the comp and upload the data", async(() => {
    component.content = true;
    component.naming = [];
    let djangoService = TestBed.get(DjangoService);
    let lookUpValuesData = { data: { desc_text_admin_documents: [{ key: "lookUpData" }] } }
    spyOn(component, "ngOnInit");
    spyOn(djangoService, "ddm_rmp_admin_documents_post").and.returnValue(of({}))
    spyOn(djangoService, "getLookupValues").and.returnValue(of(lookUpValuesData))

    fixture.detectChanges();
    let element = fixture.debugElement.nativeElement;
    let doc_data = { title: "title_rmp", url: "url", admin_flag: true };
    element.querySelector("#document-name").value = "abc";
    element.querySelector("#document-url").value = "abc";
    component.naming = [{ title: "xyz" }]
    component.editid = "id-one";
    component.document_details = doc_data;

    component.addDocument();
    // expect(component.document_details.title).toEqual(doc_data.title);
    // expect(component.document_details.url).toEqual(doc_data.url);
    expect(component.naming).toEqual(lookUpValuesData.data.desc_text_admin_documents)
    expect(element.querySelector("#document-name").value).toEqual("");
    expect(element.querySelector("#document-url").value).toEqual("");
    expect(component.editid).toEqual(undefined)

  }))

  it("should delete data when called with id", fakeAsync(() => {
    let namingData = [{ ddm_rmp_desc_text_admin_documents_id: 1, url: "url" }]
    component.content = true
    component.naming = namingData;
    let djangoService = TestBed.get(DjangoService);
    let toastr = TestBed.get(NgToasterComponent)
    spyOn(component, 'ngOnInit');
    fixture.detectChanges();
    let tosterSpy = spyOn(toastr, "success")
    let djangoSpy = spyOn(djangoService, "ddm_rmp_admin_documents_delete").and.returnValue(of({}))
    component.deleteDocument(1, 0);
    tick()
    expect(tosterSpy).toHaveBeenCalled();
    expect(djangoSpy).toHaveBeenCalled();

  }))

  it("should delete file when called with id", fakeAsync(() => {
    let namingData = { docs: [{ uploaded_file_name: 1, file_id: 1 }] }
    component.content = true
    component.isAdmin = namingData;
    let djangoService = TestBed.get(DjangoService);
    let toastr = TestBed.get(NgToasterComponent);
    spyOn(component, 'ngOnInit');
    let tosterSpy = spyOn(toastr, "success")
    let djangoSpy = spyOn(djangoService, "delete_upload_doc").and.returnValue(of({}));
    fixture.detectChanges();
    component.delete_upload_file(1, 0);
    tick();
    expect(tosterSpy).toHaveBeenCalled();
    expect(djangoSpy).toHaveBeenCalled();
  }))

  it("should upload editted document to the server", fakeAsync(() => {
    component.content = true;
    spyOn(component, 'ngOnInit');
    let spinner = TestBed.inject(NgLoaderService)
    let element = fixture.debugElement.nativeElement;
    let djangoService = TestBed.inject(DjangoService);
    let toastrService = TestBed.inject(NgToasterComponent)
    let lookUpValuesData = { data: { desc_text_admin_documents: [{ key: "lookUpData" }] } }
    spyOn(djangoService, "ddm_rmp_admin_documents_put").and.returnValue(of({}))
    spyOn(djangoService, "getLookupValues").and.returnValue(of(lookUpValuesData));
    let toastrSpy = spyOn(toastrService, "success")
    let spinnerShowSpy = spyOn(spinner, "show");
    let spinnerHideSpy = spyOn(spinner, "hide");

    component.document_details = { title: "", url: "", admin_flag: true }
    fixture.detectChanges();
    element.querySelector("#document-name").value = "doc-name";
    element.querySelector("#document-url").value = "doc-url";
    component.editDocument();
    fixture.detectChanges();
    expect(component.document_detailsEdit.title).toEqual("doc-name");
    expect(component.document_detailsEdit.url).toEqual("doc-url");
    tick();
    expect(spinnerShowSpy).toHaveBeenCalled();
    expect(spinnerHideSpy).toHaveBeenCalled();
    expect(component.naming).toEqual(lookUpValuesData.data.desc_text_admin_documents);
    expect(toastrSpy).toHaveBeenCalled();
    expect(component.changeDoc).toBeFalsy();
    expect(element.querySelector("#document-name").value).toEqual("");
    expect(element.querySelector("#document-url").value).toEqual("");

  }))


  it("should set the input fields and set a few properties", () => {
    let element = fixture.debugElement.nativeElement;
    component.content = true;
    spyOn(component, "ngOnInit");

    fixture.detectChanges();
    component.editDoc(1, "val", "url");

    expect(component.editid).toEqual(1);
    expect(component.changeDoc).toBeTruthy();
    expect(element.querySelector("#document-name").value).toEqual("val");
    expect(element.querySelector("#document-url").value).toEqual("url")
  })

});


class DataProviderMockMockService {
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


class AuthenticationMockMockService {
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
