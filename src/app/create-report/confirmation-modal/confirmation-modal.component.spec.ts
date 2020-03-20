import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let element ;

  let data = {
    modalTitle:"title",
    modalBody:"body",
    modalBtn:"button",
    confirmation:"",
    option:""
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationModalComponent ],
      imports:[MaterialModule,ReactiveFormsModule,FormsModule,MatDialogModule],
      providers:[
        
        {provide:MatDialogRef,useClass:MatDialogRefMock},
        {provide:MAT_DIALOG_DATA,useValue:data}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read the injected data and display it in template',()=>{
    fixture.detectChanges();
    expect(element.querySelector('.modal-header').textContent).toContain(data.modalTitle);
    expect(element.querySelector('.modal-body > div').textContent).toContain(data.modalBody)
  })

  it('should close the modal we clicked on close',()=>{
    let buttonSpy = spyOn(component.dialogRef,'close');
    fixture.debugElement.query(By.css('#close-modal')).triggerEventHandler('click',false);
    fixture.detectChanges();
    expect(component.data.option).toEqual('yes');
    expect(component.data.confirmation).toBeFalsy();
    expect(buttonSpy).toHaveBeenCalled();
  })
});


class MatDialogRefMock  {
  close(){

  }
}
