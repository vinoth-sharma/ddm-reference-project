import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// import { ReactiveFormsModule } from '@angular/forms';

import {
  MatGridListModule,
  MatSelectModule,
  MatFormFieldModule,
  MatDividerModule,
  MatButtonModule, 
  MatIconModule,
  MatCardModule

} from '@angular/material';

import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
import { ViewComponent } from './view/view.component';
import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { SetJoinComponent } from './set-join/set-join.component';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
import { PreviewComponent } from './preview/preview.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    // ReactiveFormsModule,

    NgxPaginationModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),

    MatButtonModule, 
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    ViewComponent,
    CalculatedColumnReportComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    PreviewComponent,
    SetJoinComponent
  ]
})

export class CreateReportModule { }
