import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSheetComponent } from './select-sheet.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('SelectSheetComponent', () => {
  let component: SelectSheetComponent;
  let fixture: ComponentFixture<SelectSheetComponent>;
  let data = {
    sheetIds: [15],
    sheetNames: ["Sheet_1"]
  }
  let element;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSheetComponent ],
      imports:[MaterialModule,ReactiveFormsModule,FormsModule,MatDialogModule,BrowserAnimationsModule],
      providers:[
        
        {provide:MatDialogRef,useClass:MatDialogRefMock},
        {provide:MAT_DIALOG_DATA,useValue:data}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSheetComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    element = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when clicked on cancel', () => {
    let closeSpy = spyOn(component.dialogRef,'close')
    element.querySelector('#cancel-modal').click();
    expect(closeSpy).toHaveBeenCalled()
  });

  

  it('should populate  injected data inside <select>',()=>{
    element.querySelector('mat-select').click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-option > span')).nativeElement.textContent).toContain(data.sheetNames[0])
  })

  it('should set properties on change of selection',()=>{
    element.querySelector('mat-select').click();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('mat-option')).nativeElement.click();
    fixture.detectChanges();
    expect(component.selectedSheet).toEqual(data.sheetIds[0])
    expect(component.selectedIndex).toEqual('0')
    expect(component.enableEditBtn).toBeTruthy()
  })


  it('should close the modal and return selected data', () => {
    element.querySelector('mat-select').click();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('mat-option')).nativeElement.click();
    fixture.detectChanges()
    let closeSpy = spyOn(component.dialogRef,'close')
    component.onEditClick();
    expect(closeSpy).toHaveBeenCalledTimes(1)
    expect(closeSpy).toHaveBeenCalledWith({'sheetId':data.sheetIds[0],index:"0"})
  });
});


class MatDialogRefMock  {
  close(){

  }
}
