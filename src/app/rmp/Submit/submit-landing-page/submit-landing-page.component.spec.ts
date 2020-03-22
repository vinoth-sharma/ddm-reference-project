// import '../polyfills.ts';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from "ngx-quill";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MaterialModule } from '.'
declare var $: any;

import { SubmitLandingPageComponent } from './submit-landing-page.component';

describe('SubmitLandingPageComponent', () => {
  let component: SubmitLandingPageComponent;
  let fixture: ComponentFixture<SubmitLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ QuillModule.forRoot(), FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, MatSnackBarModule],
      declarations: [ SubmitLandingPageComponent ],
      providers : [ DatePipe, QuillEditorComponent ]
      // QuillModule,
      // exports : [ InjectionToken ]
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

  // it('should check notify() parameters after activation', () => {
  //   fixture = TestBed.createComponent(SubmitLandingPageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.notify();
  //   expect(component.enable_edits).toBeTruthy();
  //   expect(component.editModes).toBeTruthy();
  // })

  // it('should check notify_disc() parameters after activation', () => {
  //   fixture = TestBed.createComponent(SubmitLandingPageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.notify_disc();
  //   // expect(component.enable_edit_disc).toBeTruthy();
  //   // expect(component.editModes_disc).toBeTruthy();
  // })

  // it('should check openDisclaimerModal() parameters after activation', () => {
  //   fixture = TestBed.createComponent(SubmitLandingPageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.notify_disc();
  //   // expect(component.enable_edit_disc).toBeTruthy();
  //   // expect(component.editModes_disc).toBeTruthy();
  // })

  // it('should check openDisclaimerModal() parameters after activation', () => {
  //   fixture = TestBed.createComponent(SubmitLandingPageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.openDisclaimerModal();
  //   document.getElementById('disclaimer-modal').style.overflowY
  //   // expect(window.getComputedStyle(document.getElementById("disclaimer-modal")).style.overflowY).toEqual("hidden")
  //   let element = document.getElementById('disclaimer-modal');
  //   // element.style.overflowY == 'hidden' ? return true : return false;
  //   // expect(component.enable_edit_disc).toBeTruthy();
  //   // expect(component.editModes_disc).toBeTruthy();
  // })

  // it('should check editTrue() parameters after activation', () => {
  //   fixture = TestBed.createComponent(SubmitLandingPageComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.editTrue();
  //   component.editModes = true;
  //   fixture.detectChanges();
  //   expect(component.readOnlyContentHelper).toBeTruthy();
  //   expect(component.namings).toEqual(this.original_contents);
  //   // expect(component.enable_edit_disc).toBeTruthy();
  //   // expect(component.editModes_disc).toBeTruthy();
  // })

});
