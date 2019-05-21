import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ObjectExplorerSidebarComponent } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.component";
import { PropertyComponent } from "../property/property.component";
import { VisibilityComponent } from "../visibility/visibility.component";
import { NewRelationModalComponent } from "../new-relation-modal/new-relation-modal.component";
import { ModallistComponent } from "../modallist/modallist.component";
import { ModalColumnComponent } from "../modal-column/modal-column.component";
import { ModalRolesComponent } from "../modal-roles/modal-roles.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DependentsModalComponent } from "../dependents-modal/dependents-modal.component";
import { TablesSelectionModalComponent } from "../tables-selection-modal/tables-selection-modal.component"
import { ObjectExplorerSidebarService } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { SaveAsModalComponent } from './saveAs-modal/saveAs-modal.component';
import { RelatedTablesSidebarComponent } from './sidebars/related-tables-sidebar/related-tables-sidebar.component';
import { MoreOptionSidebarComponent } from './sidebars/more-option-sidebar/more-option-sidebar.component';
import { OrderByPipe } from "./filters/order-by.pipe";
import { CalculatedColumnComponent } from "../calculated-column/calculated-column.component";
import { ValidatorDirective } from "./directives/validator.directive";
import { TooltipDirective } from "./directives/tooltip.directive";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { MatProgressSpinnerModule } from '@angular/material';

 
@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, NgMultiSelectDropDownModule, MatProgressSpinnerModule],
  declarations: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    PropertyComponent,
    VisibilityComponent,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    MoreOptionSidebarComponent,
    OrderByPipe,
    CalculatedColumnComponent,
    ValidatorDirective,
    TooltipDirective,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    PropertyComponent,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    MoreOptionSidebarComponent,
    OrderByPipe,
    CalculatedColumnComponent,
    ValidatorDirective,
    TooltipDirective,
    HeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule
  ],
  providers: [ObjectExplorerSidebarService]
})

export class SharedComponentsModule { }
