import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from "ngx-quill";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
declare var $: any;

import { SubmitLandingPageComponent } from './submit-landing-page.component';

//// Angular unit test cases written by Deepak Urs G V
fdescribe('SubmitLandingPageComponent', () => {
  let component: SubmitLandingPageComponent;
  let fixture: ComponentFixture<SubmitLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QuillModule.forRoot(), FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, MatSnackBarModule],
      declarations: [SubmitLandingPageComponent],
      providers: [DatePipe, QuillEditorComponent]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check notify() parameters after activation', () => {
    component.notify();
    expect(component.enable_edits).toBeTruthy();
    expect(component.editModes).toBeTruthy();
  })

  it('should check notify_disc() parameters after activation', () => {
    component.notify_disc();
    expect(component.enable_edit_disc).toBeTruthy();
    expect(component.editModes_disc).toBeTruthy();
  })

  it('should check openDisclaimerModal() parameters after activation', () => {
    component.openDisclaimerModal();
    expect(document.getElementById('disclaimer-modal').style.overflowY).toEqual('hidden');
  })

  it('should test the changing of text and respective parameters', () => {
    let testEvent = { text: 'Hello world!' };
    component.textChanged(testEvent);

    expect(component.textChange).toEqual(true);
    expect(component.enableUpdateData).toEqual(true);
  })

  it('should test the changing of text and respective parameters', () => {
    let testEvent = { text: ' ' };
    component.textChanged(testEvent);

    expect(component.textChange).toEqual(true);
    expect(component.enableUpdateData).toEqual(false);
  })

  it('should test the edit_True parameters', () => {
    component.editModes = true;

    component.edit_True();

    expect(component.readOnlyContentHelper).toEqual(true);
    expect(component.editModes).toEqual(false)
    expect(component.namings).toEqual(component.original_contents);
  })

  it('should check the parameters of the edit_True_disclaimer() being called', () => {
    component.editModes_disc = true;
    component.content_edit_disclaimer();
    fixture.detectChanges();

    expect(component.editModes_disc).toEqual(true);
    expect(component.readOnlyContentDisclaimer).toEqual(true);

  })

  it('should check the parameters of the edit_True_disclaimer() being called', () => {
    component.editModes_disc = false;
    component.content_edit_disclaimer();
    fixture.detectChanges();

    expect(component.readOnlyContentDisclaimer).toEqual(true);
    expect(component.editModes_disc).toEqual(false);
  })

});
