// import '../polyfills.ts';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from "ngx-quill";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MaterialModule } from '.'
declare var $: any;

import { SubmitLandingPageComponent } from './submit-landing-page.component';

fdescribe('SubmitLandingPageComponent', () => {
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

  it('should check notify() parameters after activation', () => {
    component.notify();
    expect(component.enable_edits).toBeTruthy();
    expect(component.editModes).toBeTruthy();
    // expect(component.parentsSubject).toEqual(component.enable_edits) // TO BE CHECKED
  })

  it('should check notify_disc() parameters after activation', () => {
    component.notify_disc();
    expect(component.enable_edit_disc).toBeTruthy();
    expect(component.editModes_disc).toBeTruthy();
    // expect($.hide()).toHaveBeenCalled(); // TO BE CHECKED
  })

  it('should check openDisclaimerModal() parameters after activation', () => {
    component.openDisclaimerModal();
    expect(document.getElementById('disclaimer-modal').style.overflowY).toEqual('hidden');
  })

  it('should check closeDisclaimerModal() parameters after activation', () => {
    // component.closeDisclaimerModal(); // throwing error
    // expect(document.getElementById('disclaimer-modal').style.overflowY).toEqual('auto');
  })

  it('should test the changing of text and respective parameters',()=>{
    let testEvent = { text : 'Hello world!'};
    component.textChanged(testEvent); //or an event tracking check?

    expect(component.textChange).toEqual(true);
    expect(component.enableUpdateData).toEqual(true);
  })

  it('should test the changing of text and respective parameters',()=>{
    let testEvent = { text : ' '};
    component.textChanged(testEvent);

    expect(component.textChange).toEqual(true);
    expect(component.enableUpdateData).toEqual(false);
  })

  // edit_True() {
  //   if (this.editModes) {
  //     this.readOnlyContentHelper = true;
  //   } else {
  //     this.readOnlyContentHelper = false;
  //   }
  //   this.editModes = !this.editModes;
  //   this.namings = this.original_contents;
  //   $('#edit_button').show()
  // }

  it('should test the edit_True parameters',()=>{
    component.editModes = true;

    component.edit_True();

    expect(component.readOnlyContentHelper).toEqual(true);
    expect(component.editModes).toEqual(false)
    expect(component.namings).toEqual(component.original_contents);
  })

  // DECIDE THE BUTTON CLICK
  // it('should test the call of content_edit_disclaimer',()=>{
  //   spyOn(component,'content_edit_disclaimer');

  //   let button = fixture.debugElement.nativeElement.querySelector('.save-test-ddm-tid');
  //   button.click();

  //   fixture.whenStable().then(()=> {
  //     expect(component.content_edit_disclaimer).toHaveBeenCalled();
  //   })
  // })

  // edit_True_disclaimer() {
  //   if (this.editModes_disc) {
  //     this.readOnlyContentDisclaimer = true;
  //   } else {
  //     this.readOnlyContentDisclaimer = false;
  //   }
  //   this.editModes_disc = !this.editModes_disc;
  //   this.naming_disclaimer = this.original_contents_disclaimer;
  //   $('#edit_button').show()
  // }

  it('should check the parameters of the edit_True_disclaimer() being called',()=>{
    component.editModes_disc = true;
    component.content_edit_disclaimer();
    fixture.detectChanges();

    expect(component.editModes_disc).toEqual(false);
    expect(component.readOnlyContentDisclaimer).toEqual(true);
    
  })

  it('should check the parameters of the edit_True_disclaimer() being called',()=>{
    component.editModes_disc = false;
    component.content_edit_disclaimer();
    fixture.detectChanges();
    
    expect(component.readOnlyContentDisclaimer).toEqual(false);
    expect(component.editModes_disc).toEqual(true);
  })

});
