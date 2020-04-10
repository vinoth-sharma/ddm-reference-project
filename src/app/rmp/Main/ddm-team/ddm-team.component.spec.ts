import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdmTeamComponent } from './ddm-team.component';
import { QuillModule } from "ngx-quill";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from "../../../authentication.service";
import { MaterialModule } from "../../../material.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DdmTeamComponent', () => {
  let component: DdmTeamComponent;
  let fixture: ComponentFixture<DdmTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdmTeamComponent ],
      imports : [QuillModule.forRoot(),FormsModule,ReactiveFormsModule,HttpClientTestingModule,MaterialModule,NoopAnimationsModule],
      providers : [AuthenticationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmTeamComponent);
    component = fixture.componentInstance;
    component.content = mock_data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("textChanged func",()=>{
    component.textChanged({text: "hjh "});
    expect(component.textChange).toEqual(true)
    expect(component.enableUpdateData).toEqual(true)
  })

  it('edit_True func', () => {
    component.original_contents = "original";
    component.edit_True();
    expect(component.editModes).toEqual(false);
    expect(component.readOnlyContentHelper).toEqual(true);
    expect(component.namings).toEqual("original");
  });

  it('editEnableHelp func', () => {
    component.original_contents = "original";
    component.editEnableHelp();
    expect(component.editModes).toEqual(true);
    expect(component.readOnlyContentHelper).toEqual(false);
    expect(component.namings).toEqual("original");
  });

  it("editTrue func",()=>{
    component.editMode = true;
    component.original_content = "original";
    component.editTrue();
    expect(component.readOnlyContent).toEqual(true)
    expect(component.editMode).toEqual(false);
    expect(component.naming).toEqual("original");
  })

  it("content_edits func",()=>{
    component.textChange = true;
    component.enableUpdateData = false;
    component.content_edits();
  })
  
  it("content_edit func",()=>{
    component.textChange = true;
    component.enableUpdateData = false;
    component.content_edit();
  })
  
});

var mock_data = {
  message : "success",
  data : {
    desc_text : [{ddm_rmp_desc_text_id: 3,
      module_name: "Submit Request",
      description: "nan"}]
  }
}