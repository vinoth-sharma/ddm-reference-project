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
import { HierarchyComponent } from './parameters/hierarchy/hierarchy.component';
import { ManageParametersComponent } from './parameters/manage-parameters/manage-parameters.component';
import { ReportContainerComponent } from './report-view/report-container/report-container.component';
import { TableContainerComponent } from './report-view/table-container/table-container.component';

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
    TableContainerComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    MatInputModule,
    MatCheckboxModule,
    MatListModule
  ],
  entryComponents: [
    ChartSelectorComponent,
    PivotBuilderComponent
  ]
})

export class ReportModule { }
