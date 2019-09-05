import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InsertComponent } from './insert/insert.component';
import { HomeComponent } from './home/home.component';
import { TableContComponent } from './table-cont/table-cont.component';
import { ChartComponent } from './chart/chart.component';
import { PivotComponent } from './pivot/pivot.component';
import { ChartSelectorComponent } from './chart-selector/chart-selector.component';
import { PivotBuilderComponent } from './pivot-builder/pivot-builder.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CreateComponent } from './parameters/create/create.component';
import { MatInputModule, MatCheckboxModule, MatListModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatSidenavModule } from '@angular/material/sidenav'
import { HierarchyComponent } from './parameters/hierarchy/hierarchy.component';
import { ManageParametersComponent } from './parameters/manage-parameters/manage-parameters.component';
import { ReportContainerComponent } from './report-view/report-container/report-container.component';
import { TableContainerComponent } from './report-view/table-container/table-container.component';
import { TableMenuComponent } from './report-view/table-menu/table-menu.component';
import { ChartsComponent } from './report-view/charts/charts.component';
import { PivotsComponent } from './report-view/pivots/pivots.component';
import { TableContainerWrapperComponent } from './report-view/table-container-wrapper/table-container-wrapper.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from '@angular/material/tooltip'
import { BarChartComponent } from './report-view/custom-components/bar-chart/bar-chart.component';
import { PieChartComponent } from './report-view/custom-components/pie-chart/pie-chart.component';
import { LineChartComponent } from './report-view/custom-components/line-chart/line-chart.component';
import { ScatterPlotComponent } from './report-view/custom-components/scatter-plot/scatter-plot.component';
import { ChartContainerWrapperComponent } from './report-view/chart-container-wrapper/chart-container-wrapper.component';
import { CloneWorksheetComponent } from './report-view/clone-worksheet/clone-worksheet.component';
import { UploadFileComponent } from './report-view/upload-file/upload-file.component';
import { DragDropDirective } from './report-view/custom-directives/drag-drop.directive';
import { ButtonCssDirective } from './report-view/custom-directives/button-css.directive';
import { RenameSheetComponent } from './report-view/rename-sheet/rename-sheet.component';
import { DownloadReportComponent } from './report-view/download-report/download-report.component';
import { CreateParametersComponent } from './report-view/create-parameters/create-parameters.component';
import { TableParametersComponent } from './report-view/table-parameters/table-parameters.component'
import { ManageTableParametersComponent } from './report-view/manage-parameters/manage-parameters.component';
import { ConfirmationDialogComponent } from './report-view/custom-components/confirmation-dialog/confirmation-dialog.component';
import { PivotTableWrapperComponent } from './report-view/pivot-table-wrapper/pivot-table-wrapper.component';
import { ConfigureChartComponent } from './report-view/configure-chart/configure-chart.component'
import { ColorPickerModule } from 'ngx-color-picker';
import { ConfigurePivotComponent } from './report-view/configure-pivot/configure-pivot.component';
import { EditParametersComponent } from './report-view/edit-parameters/edit-parameters.component';
import { CloneParametersComponent } from './report-view/clone-parameters/clone-parameters.component'

@NgModule({
  declarations: [
    InsertComponent,
    HomeComponent,
    TableContComponent,
    ChartComponent,
    PivotComponent,
    ChartSelectorComponent,
    PivotBuilderComponent,
    CreateComponent,
    HierarchyComponent,
    ManageParametersComponent,
    ReportContainerComponent,
    TableContainerComponent,
    TableMenuComponent,
    ChartsComponent,
    PivotsComponent,
    TableContainerWrapperComponent,
    BarChartComponent,
    PieChartComponent,
    LineChartComponent,
    ScatterPlotComponent,
    ChartContainerWrapperComponent,
    CloneWorksheetComponent,
    UploadFileComponent,
    DragDropDirective,
    ButtonCssDirective,
    RenameSheetComponent,
    DownloadReportComponent,
    CreateParametersComponent,
    TableParametersComponent,
    ManageTableParametersComponent,
    ConfirmationDialogComponent,
    PivotTableWrapperComponent,
    ConfigureChartComponent,
    ConfigurePivotComponent,
    EditParametersComponent,
    CloneParametersComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    MatInputModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatChipsModule,
    MatSidenavModule,
    ColorPickerModule,
    MatTooltipModule
  ],
  entryComponents: [
    ChartSelectorComponent,
    PivotBuilderComponent,
    ChartsComponent,
    PivotsComponent,
    CloneWorksheetComponent,
    UploadFileComponent,
    RenameSheetComponent,
    DownloadReportComponent,
    CreateParametersComponent,
    TableParametersComponent,
    ManageTableParametersComponent,
    ConfirmationDialogComponent,
    PivotTableWrapperComponent
  ]
})

export class ReportModule { }
