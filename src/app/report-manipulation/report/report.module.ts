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
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { HierarchyComponent } from './parameters/hierarchy/hierarchy.component';
import { ManageParametersComponent } from './parameters/manage-parameters/manage-parameters.component';
import { ReportContainerComponent } from './report-view/report-container/report-container.component';
import { TableContainerComponent } from './report-view/table-container/table-container.component';
import { TableMenuComponent } from './report-view/table-menu/table-menu.component';
import { ChartsComponent } from './report-view/charts/charts.component';
import { PivotsComponent } from './report-view/pivots/pivots.component';
import { TableContainerWrapperComponent } from './report-view/table-container-wrapper/table-container-wrapper.component';
import { MatDialogModule } from "@angular/material/dialog";
import { BarChartComponent } from './report-view/custom-components/bar-chart/bar-chart.component';
import { PieChartComponent } from './report-view/custom-components/pie-chart/pie-chart.component';
import { LineChartComponent } from './report-view/custom-components/line-chart/line-chart.component';
import { ScatterPlotComponent } from './report-view/custom-components/scatter-plot/scatter-plot.component';
import { ChartContainerWrapperComponent } from './report-view/chart-container-wrapper/chart-container-wrapper.component';
import { CloneWorksheetComponent } from './report-view/clone-worksheet/clone-worksheet.component';


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
    CloneWorksheetComponent],
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
    MatDialogModule
  ],
  entryComponents: [
    ChartSelectorComponent,
    PivotBuilderComponent,
    ChartsComponent,
    PivotsComponent,
    CloneWorksheetComponent
  ]
})

export class ReportModule { }
