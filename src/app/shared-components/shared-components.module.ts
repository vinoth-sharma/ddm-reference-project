import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ObjectExplorerSidebarComponent } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.component";
import { PropertyComponent } from "../property/property.component";
import { CreateLovComponent } from "../modallist/create-lov/create-lov.component";
import { VisibilityComponent } from "../visibility/visibility.component";
import { ModallistComponent } from "../modallist/modallist.component";
import { ModalColumnComponent } from "../modal-column/modal-column.component";
import { ModalRolesComponent } from "../modal-roles/modal-roles.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DependentsModalComponent } from "../dependents-modal/dependents-modal.component";
import { TablesSelectionModalComponent } from "../tables-selection-modal/tables-selection-modal.component"
import { ObjectExplorerSidebarService } from "./sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { SaveAsModalComponent } from './saveAs-modal/saveAs-modal.component';
import { RelatedTablesSidebarComponent } from './sidebars/related-tables-sidebar/related-tables-sidebar.component';
import { OrderByPipe } from "./filters/order-by.pipe";
import { CalculatedColumnComponent } from "../calculated-column/calculated-column.component";
import { ValidatorDirective } from "./directives/validator.directive";
import { TooltipDirective } from "./directives/tooltip.directive";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { MatProgressSpinnerModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatAutocompleteModule, MatSelectModule , MatChipsModule, MatCardModule, MatInputModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner"
import { from } from 'rxjs';
import { EditDescriptionComponent } from './sidebars/edit-description/edit-description.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from "@angular/material/badge";
@NgModule({
  imports: [CommonModule, 
    FormsModule, 
    NgbModule, 
    NgMultiSelectDropDownModule, 
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTabsModule
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
    ModalColumnComponent,
    ModalRolesComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    OrderByPipe,
    CalculatedColumnComponent,
    ValidatorDirective,
    TooltipDirective,
    HeaderComponent,
    FooterComponent,
    EditDescriptionComponent,
    CreateLovComponent
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
    ModalColumnComponent,
    ModalRolesComponent,
    SaveAsModalComponent,
    RelatedTablesSidebarComponent,
    OrderByPipe,
    CalculatedColumnComponent,
    ValidatorDirective,
    TooltipDirective,
    HeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule
  ],
  providers: [ObjectExplorerSidebarService,NgxSpinnerService]
})

export class SharedComponentsModule { }
