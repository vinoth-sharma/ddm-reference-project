import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ReferenceDocComponent } from './reference-doc.component';
import { QuillModule } from "ngx-quill";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from "../../../authentication.service";
import { MaterialModule } from "../../../material.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Utils from "../../../../utils";
import { DjangoService } from "../../django.service";
import { of } from 'rxjs';

describe('ReferenceDocComponent', () => {
  let component: ReferenceDocComponent;
  let fixture: ComponentFixture<ReferenceDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferenceDocComponent],
      imports: [QuillModule.forRoot(), FormsModule, ReactiveFormsModule, HttpClientTestingModule, MaterialModule, NoopAnimationsModule],
      providers: [DjangoService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDocComponent);
    component = fixture.componentInstance;
    component.content = mock_data;
    component.isRef.docs = mockIsRef;
    spyOn(Utils, "showSpinner")
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("upload func", () => {
    component.upload(true);
    const nativeElement = fixture.nativeElement;
    const input = nativeElement.querySelector('#document-url');
    expect(input.value).toEqual("");
  })

  it("textChanged func", () => {
    component.textChanged({ text: "hjh " });
    expect(component.textChange).toEqual(true)
    expect(component.enableUpdateData).toEqual(true)
  })

  it('edit_True func', () => {
    component.original_content = "original";
    component.edit_True();
    expect(component.editModes).toEqual(false);
    expect(component.readOnlyContentHelper).toEqual(true);
    expect(component.namings).toEqual("original");
  });

  it('editEnable func', () => {
    component.original_content = "original";
    component.editEnable();
    expect(component.editModes).toEqual(true);
    expect(component.readOnlyContentHelper).toEqual(false);
    expect(component.namings).toEqual("original");
  });

  it("content_edit func", () => {
    component.content_edit();
    expect(component.editMode).toEqual(false)
  })

  it("editTrue func", () => {
    component.content_edit();
    component.editTrue();
    expect(component.editMode).toEqual(true);
  })

  it("deleteDocument func", () => {
    let djangoService = TestBed.inject(DjangoService);

    spyOn(djangoService, "ddm_rmp_reference_documents_delete").and.returnValue(of({ data: [], status: 200 }));
    spyOn(Utils, "hideSpinner")
    component.deleteDocument(12, 0);
    const nativeElement = fixture.nativeElement;
    const ele = nativeElement.querySelector('#editable0');
    // tick();
    expect(ele.style.display).toEqual("none");
  })

  it("delete_upload_file func", () => {
    let djangoService = TestBed.inject(DjangoService);
    spyOn(djangoService, "delete_upload_doc").and.returnValue(of({ data: [], status: 200 }));
    spyOn(Utils, "hideSpinner")
    component.delete_upload_file(12, 0);
    const nativeElement = fixture.nativeElement;
    const ele = nativeElement.querySelector('#upload_doc0');
    expect(ele.style.display).toEqual("none");
  })

  it("editDoc func", () => {
    component.editDoc(12, "sample", "https://www.google.com", "testIndex");
    const nativeElement = fixture.nativeElement;
    const ele = nativeElement.querySelector('#document-name');
    const ele1 = nativeElement.querySelector('#document-url');
    expect(component.editid).toEqual(12);
    expect(component.changeDoc).toEqual(true);
    expect(ele.value).toEqual("sample")
    expect(ele1.value).toEqual("https://www.google.com")
  })

  it("NewDoc func", () => {
    const nativeElement = fixture.nativeElement;
    const ele = nativeElement.querySelector('#document-name');
    const ele1 = nativeElement.querySelector('#document-url');
    component.NewDoc();
    expect(component.editid).toEqual(undefined);
    expect(ele.value).toEqual("")
    expect(ele1.value).toEqual("")
  })

});



var mock_data = {
  message: "success",
  data: {
    desc_text: [{
      ddm_rmp_desc_text_id: 3,
      module_name: "Submit Request",
      description: "nan"
    }],
    desc_text_reference_documents: [{
      ddm_rmp_desc_text_reference_documents_id: 12,
      url: "https://www.google.com",
      title: "sample",
    }]
  }
}

var mockIsRef = [{
  file_id: 12,
  uploaded_file_name: "sample",
}]