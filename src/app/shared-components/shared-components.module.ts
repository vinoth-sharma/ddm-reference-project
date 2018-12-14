import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ObjectExplorerSidebarComponent } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.component";
import { Modal2Component } from "../modal2/modal2.component";
import { NewRelationModalComponent } from "../new-relation-modal/new-relation-modal.component";
import { ModallistComponent } from "../modallist/modallist.component";
import { ModalColumnComponent } from "../modal-column/modal-column.component";
import { ModalRolesComponent } from "../modal-roles/modal-roles.component";
import { ModalPrivilegeComponent } from "../modal-privilege/modal-privilege.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ModalPrivilege2Component } from "../modal-privilege2/modal-privilege2.component";
import { ModalPrivilege1Component } from "../modal-privilege1/modal-privilege1.component";
import { DependentsModalComponent } from "../dependents-modal/dependents-modal.component";
import { TablesSelectionModalComponent } from "../tables-selection-modal/tables-selection-modal.component"
import { ObjectExplorerSidebarService } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.service";

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, NgMultiSelectDropDownModule],
  declarations: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    Modal2Component,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    ModalPrivilegeComponent,
    ModalPrivilege2Component,
    ModalPrivilege1Component
  ],
  exports: [
    InlineEditComponent,
    ConfirmModalComponent,
    DependentsModalComponent,
    TablesSelectionModalComponent,
    ObjectExplorerSidebarComponent,
    Modal2Component,
    NewRelationModalComponent,
    ModallistComponent,
    ModalColumnComponent,
    ModalRolesComponent,
    ModalPrivilegeComponent,
    ModalPrivilege2Component,
    ModalPrivilege1Component
  ],
  providers: [ObjectExplorerSidebarService]
})

export class SharedComponentsModule { }
