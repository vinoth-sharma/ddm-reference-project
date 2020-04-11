import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { InputValidatorDirective } from "./input-validator.directive";
import { CustomPipeModules } from "../custom-directives/custom.pipes.module";
import { OrderByComponent } from './order-by/order-by.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { SelectSheetComponent } from './select-sheet/select-sheet.component';
import { SaveSheetDialogComponent } from './save-sheet-dialog/save-sheet-dialog.component';
import { PreviewTableContainerComponent } from './preview-table-container/preview-table-container.component';
import { CalculatedColumnComponent } from './calculated-column/calculated-column.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // BrowserModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    FormsModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CustomPipeModules.forRoot(), 
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    OrderByComponent,
    RequestDetailsComponent,
    SelectSheetComponent,
    SaveSheetDialogComponent,
    InputValidatorDirective,
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
  ],
  entryComponents: [SelectSheetComponent,SaveSheetDialogComponent,ConfirmationModalComponent]
})

export class CreateReportModule { }