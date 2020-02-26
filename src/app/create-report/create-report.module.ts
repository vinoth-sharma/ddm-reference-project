import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
// import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { CreateCalculatedColumnComponent } from './create-calculated-column/create-calculated-column.component';
import { InputValidatorDirective } from "./input-validator.directive";
import { MultiSelectComponent } from "../custom-directives/multi-select/multi-select.component";
import { CustomPipeModules } from "../custom-directives/custom.pipes.module";
// import { ValidatorDirective } from '../shared-components/directives/validator.directive';
import { OrderByComponent } from './order-by/order-by.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { SelectSheetComponent } from './select-sheet/select-sheet.component';
import { SaveSheetDialogComponent } from './save-sheet-dialog/save-sheet-dialog.component';
import { PreviewTableContainerComponent } from './preview-table-container/preview-table-container.component';
import { CalculatedColumnComponent } from './calculated-column/calculated-column.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
// import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
import { MaterialModule } from "../material.module";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CustomPipeModules.forRoot(), 
    MaterialModule.forRoot()
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    // CreateCalculatedColumnComponent,
    OrderByComponent,
    RequestDetailsComponent,
    SelectSheetComponent,
    SaveSheetDialogComponent,
    InputValidatorDirective,
    MultiSelectComponent,
    PreviewTableContainerComponent,
    CalculatedColumnComponent,
    ConfirmationModalComponent
  ],
  exports: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    // CreateCalculatedColumnComponent
  ],
  entryComponents: [SelectSheetComponent,SaveSheetDialogComponent,ConfirmationModalComponent]
})

export class CreateReportModule { }