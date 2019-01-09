import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ObjectExplorerSidebarComponent } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.component";
import { propertyComponent } from "../property/property.component";
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
import { CalculatedColumnComponent } from "../calculated-column/calculated-column.component";

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, NgMultiSelectDropDownModule],
  declarations: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    propertyComponent,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    CalculatedColumnComponent
  ],
  exports: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    propertyComponent,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    CalculatedColumnComponent
  ],
  providers: [ObjectExplorerSidebarService]
})

export class SharedComponentsModule { }
