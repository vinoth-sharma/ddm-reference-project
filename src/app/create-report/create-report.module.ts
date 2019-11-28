import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import {MatTableModule,MatGridListModule,MatIconModule} from '@angular/material';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CreateReportLayoutComponent } from './create-report-layout/create-report-layout.component';
import { FormulaComponent } from './formula/formula.component';
import { SelectTablesComponent } from './select-tables/select-tables.component';
import { AddConditionsComponent } from './add-conditions/add-conditions.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
// import { CalculatedColumnReportComponent } from './calculated-column-report/calculated-column-report.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';
// import { NgxPaginationModule } from 'ngx-pagination';
import { CreateCalculatedColumnComponent } from './create-calculated-column/create-calculated-column.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
// import { MatFormFieldModule, MatAutocomplete, MatCheckbox, MatCheckboxModule } from '@angular/material';
import { JoinsHelpOptionComponent } from './joins-help-option/joins-help-option.component';
import { InputValidatorDirective } from "./input-validator.directive";
import { MultiSelectComponent } from "../custom-directives/multi-select/multi-select.component";
import {
  MatFormFieldModule, 
  MatAutocompleteModule, 
  MatCheckbox, 
  MatExpansionModule,
  MatStepperModule,
  MatCheckboxModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatSortModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatRadioModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatTooltipModule,
  MatDialogModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatTableModule,
  MatGridListModule,
  MatIconModule
} from '@angular/material';

// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ValidatorDirective } from '../shared-components/directives/validator.directive';
import { OrderByComponent } from './order-by/order-by.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { SelectSheetComponent } from './select-sheet/select-sheet.component';
import { SaveSheetDialogComponent } from './save-sheet-dialog/save-sheet-dialog.component';
// import { ApplyAggregationsComponent } from './apply-aggregations/apply-aggregations.component';


@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    MatCheckboxModule,
    RouterModule,
    MatTableModule,   
    BrowserModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatStepperModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatSidenavModule,
    MatSortModule,
    MatSelectModule,
    MatSliderModule,
    MatRadioModule,
    MatStepperModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    SharedComponentsModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    CreateCalculatedColumnComponent,
    OrderByComponent,
    RequestDetailsComponent,
    SelectSheetComponent,
    SaveSheetDialogComponent,
    InputValidatorDirective,
    MultiSelectComponent
  ],
  exports: [
    CreateReportLayoutComponent,
    FormulaComponent,
    SelectTablesComponent,
    AddConditionsComponent,
    GenerateReportModalComponent,
    AddConditionsComponent,
    ApplyAggregationsComponent,
    CreateCalculatedColumnComponent
  ],
  entryComponents: [SelectSheetComponent,SaveSheetDialogComponent]
})

export class CreateReportModule { }