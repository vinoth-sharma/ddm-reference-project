import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../../../../material.module";
import { CustomPipeModules } from "../../../../custom-directives/custom.pipes.module";
import { PivotsComponent } from './pivots.component';
import { PivotTableWrapperComponent } from "../pivot-table-wrapper/pivot-table-wrapper.component";
import { ConfigurePivotComponent } from "../configure-pivot/configure-pivot.component";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from "ngx-toastr";
import { Component, NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('PivotsComponent', () => {
  let component;
  let fixture;

  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  // let component: NoopComponent;
  // let fixture: ComponentFixture<NoopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [DialogTestModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: ToastrService, useValue: [] }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('Create component', () => {
    let obj = {
      sheetData: {
        sheetName: 'Sheet 1',
      }
    }
    let dialog = TestBed.get(MatDialog);
    expect(dialog.open(PivotsComponent, obj)).toBeTruthy();
    // expect(dialog.close(PivotsComponent, obj)).toBeTruthy();
  })

    it('Test rowFieldSelection function ', () => {
      component.rowFieldSelected({ value: 'sample' });
      expect(component.selected.data.rowField).toEqual('sample');
    });

  it('Test dataFieldSelected function ', () => {
    component.dataFieldSelected({ value: ["value 1", "value 2"] });
    expect(component.selected.data.dataField).toEqual([{ value: 'value 1', function: '' }, { value: 'value 2', function: '' }]);
    expect(component.selected.data.dataField).not.toEqual([{ value: 'value 761', function: '' }, { value: 'value 2', function: '' }]);
  });

  it('Test FormValid func', () => {
    expect(component.formValid()).toEqual(false);
  })


  it('Test formValidPreview func', () => {
    expect(component.formValidPreview()).toEqual(false);
  })

  it('Test previewPivot func', () => {
    component.pivotResGenerated(true);
    expect(component.isPivotVaid).toEqual(true);
  });

  it('Test isEmpty func', () => {
    component.selected.tab_name = "tab"
    expect(component.isEmpty()).toEqual(false);
  });


});


// Noop component is only a workaround to trigger change detection
@Component({
  template: ''
})
class NoopComponent { }

const TEST_DIRECTIVES = [
  PivotsComponent,
  NoopComponent,
  PivotTableWrapperComponent,
  ConfigurePivotComponent
];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule, MaterialModule, CustomPipeModules, FormsModule, HttpClientTestingModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    PivotsComponent
  ],
})
class DialogTestModule { }