import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
import { ViewComponent } from './view/view.component';
import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
import { PreviewComponent } from './preview/preview.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { SetJoinComponent } from './set-join/set-join.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
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
