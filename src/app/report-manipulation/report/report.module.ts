import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReportRoutingModule } from './report-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ReportContainerComponent } from './report-view/report-container/report-container.component';
import { TableContainerComponent } from './report-view/table-container/table-container.component';
import { TableMenuComponent } from './report-view/table-menu/table-menu.component';
import { ChartsComponent } from './report-view/charts/charts.component';
import { PivotsComponent } from './report-view/pivots/pivots.component';
import { TableContainerWrapperComponent } from './report-view/table-container-wrapper/table-container-wrapper.component';
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
import { CloneParametersComponent } from './report-view/clone-parameters/clone-parameters.component';
import { ConfigureTableComponent } from './report-view/configure-table/configure-table.component'
import { InputValidatorDirectiveReportView } from "./report-view/custom-directives/input-validator.directive";
import { CustomPipeModules } from "../../custom-directives/custom.pipes.module";
import { MaterialModule } from "../../material.module";

@NgModule({
  declarations: [
    HomeComponent,
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
    CloneParametersComponent,
    ConfigureTableComponent,
    InputValidatorDirectiveReportView],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedComponentsModule,
    ColorPickerModule,
    CustomPipeModules.forRoot(),
    MaterialModule.forRoot()
  ],
  entryComponents: [
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
    PivotTableWrapperComponent,
    ConfigureTableComponent
  ]
})
export class ReportModule { }
