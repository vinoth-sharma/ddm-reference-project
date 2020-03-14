import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SaveSheetDialogComponent } from './save-sheet-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

fdescribe('SaveSheetDialogComponent', () => {
  let component: SaveSheetDialogComponent;
  let fixture: ComponentFixture<SaveSheetDialogComponent>;
  let data = {
    sl_id: 1,
    report_id: 1,
    user_id: 1
  }
  let serverData = {
    data: {
      report_list: [{ report_id: 1, sheet_names: ['sheetNames'], report_name: "reportName" }]
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveSheetDialogComponent],
      imports: [MaterialModule, ReactiveFormsModule, HttpClientTestingModule, FormsModule],
      providers: [{ provide: MatDialogRef, useClass: MatDialogRefMock },
      { provide: MAT_DIALOG_DATA, useValue: data }]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data from server', fakeAsync(() => {
    let httpSpy = spyOn(component, "getReportDataByID").and.returnValue(of(serverData));
    component.getReportData();
    tick();
    console.log("component data", component.reportList)
    expect(component.reportList).toEqual(serverData.data.report_list)
  }))

  it('should close the modal when clicked on save and return data', () => {
    let id = "#save"
    let modal = new setComponentData(component, fixture, id, serverData)
    expect(modal.spyOnClose()).toHaveBeenCalledWith({
      sheet_name: 'sheetName',
      report_name: 'reportName',
      isSave: true
    })
  })

  it('should close the modal when clicked on cancel and return data', () => {
    let id = "#cancelModel"
    let modal = new setComponentData(component, fixture, id, serverData)
    expect(modal.spyOnClose()).toHaveBeenCalledWith({
      sheet_name: 'sheetName',
      report_name: 'reportName',
      isSave: false
    })
  })

  it('should return true if sheetname is present in the list(selected sheets)', () => {
    component.selectedSheets = ['abc', 'def'];
    component.sheetName = "abc";
    expect(component.checkSheetNameExist()).toBeTruthy();
  })

  it('should return false if sheetname is not present in the list(selected sheets)', () => {
    component.selectedSheets = ['abc', 'def'];
    component.sheetName = "ab";
    expect(component.checkSheetNameExist()).toBeFalsy();
  })

  it('should return false if sheetname is not present in the list(selected sheets)', () => {
    component.sheetName = "ab";
    expect(component.isEmpty()).toBeFalsy();
  })

  it('should return true if sheetname is not present in the list(selected sheets)', () => {
    component.sheetName = "";
    expect(component.isEmpty()).toBeTruthy();
  })
});

class MatDialogRefMock {
  close() {
  }
}

class setComponentData {
  public spy;
  constructor(public component, public fixture, public id, public serverData) {
    let element = fixture.debugElement.nativeElement;
    let button = element.querySelector(id);
    component.selectedSheets = serverData.data.report_list[0].sheet_names;
    component.sheetName = "sheetName";
    component.reportName = "reportName"
    fixture.detectChanges();
    console.log(component.isEmpty(), component.checkSheetNameExist(), button)
    this.spy = spyOn(this.component.dialogRef, "close")
    button.click();
  }

  spyOnClose() {
    return this.spy;
  }
}
