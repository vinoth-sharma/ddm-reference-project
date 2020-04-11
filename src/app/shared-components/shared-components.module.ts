import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ObjectExplorerSidebarComponent } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.component";
import { PropertyComponent } from "../property/property.component";
import { CreateLovComponent } from "../modallist/create-lov/create-lov.component";
import { VisibilityComponent } from "../visibility/visibility.component";
import { ModallistComponent } from "../modallist/modallist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DependentsModalComponent } from "../dependents-modal/dependents-modal.component";
import { TablesSelectionModalComponent } from "../tables-selection-modal/tables-selection-modal.component"
import { ObjectExplorerSidebarService } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { SaveAsModalComponent } from './saveAs-modal/saveAs-modal.component';
import { RelatedTablesSidebarComponent } from './sidebars/related-tables-sidebar/related-tables-sidebar.component';
import { ValidatorDirective } from "./directives/validator.directive";
import { MatSelectModule } from "@angular/material/select";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner"
import { EditDescriptionComponent } from './sidebars/edit-description/edit-description.component';
import { LovContainerComponent } from '../modallist/lov-container/lov-container.component';
import { ShowLovComponent } from '../modallist/show-lov/show-lov.component';
import { JoinsHelpOptionComponent } from '../create-report/joins-help-option/joins-help-option.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MaximumCharacterPipe } from './maximum-character.pipe';
import { CustomPipeModules } from "../custom-directives/custom.pipes.module";
// import { MaterialModule } from "../material.module";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    NgbModule, 
    NgMultiSelectDropDownModule, 
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    CustomPipeModules.forRoot(),
    // MaterialModule.forRoot()
  ],
  declarations: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    PropertyComponent,
    VisibilityComponent,
    ModallistComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    ValidatorDirective,
    EditDescriptionComponent,
    CreateLovComponent,
    ShowLovComponent,
    LovContainerComponent,
    JoinsHelpOptionComponent,
    MaximumCharacterPipe,
  ],
  exports: [
    InlineEditComponent,
    EditDescriptionComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    PropertyComponent,
    ModallistComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    ValidatorDirective,
    JoinsHelpOptionComponent,
    MaximumCharacterPipe
    // CalculatedColumnComponent
  ],
  entryComponents : [LovContainerComponent],
  providers: [ObjectExplorerSidebarService,NgxSpinnerService]
})

export class SharedComponentsModule { }
