import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import Utils from '../../../utils';
import { ToastrService } from 'ngx-toastr';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { CreateRelationService } from '../create-relation.service';
import { CreateRelationComponent } from '../create-relation/create-relation.component';
declare var $: any;

@Component({
  selector: 'app-show-relations',
  templateUrl: './show-relations.component.html',
  styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

  @Output() editSelectedRelation = new EventEmitter();
  @Output() relNames = new EventEmitter();
  relationships:any[] = [];
  isLoading:boolean = true;
  tables = {};
  confirmText:string = 'Are you sure you want to delete the relationship?';
  confirmHeader:string = 'Delete relationship';
  rId : number;

  constructor(
    private dialogRef: MatDialogRef<ShowRelationsComponent>,
    private relationService:CreateRelationService,
    private dialog: MatDialog,
    private objectExplorerSidebarService:ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = Array.isArray(tables) ? tables : [];
    });

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['customTables'] = customTables || [];
    })
   this.getRelations();
  }

  getTableData(tableId, type, isCustom) {
    if(isCustom) {
        return this.tables['customTables'].filter(data => {
          return data.custom_table_id === tableId;
        })[0].custom_table_name;
    }else {
      return this.tables['tables'].filter(data => {
        return data.sl_tables_id === tableId;
      })[0].mapped_table_name;
    }
  }

  getRelations() {
     this.isLoading = true;
     Utils.closeModals();
     this.relationService.getRelations( this.data.semanticId).subscribe(res => {
       this.isLoading = false;
       this.relationships = res['data'];
       this.relationships.forEach(data => {
         data['left_table_name'] = this.getTableData(data.left_table,'left',data.is_left_custom);
         data['right_table_name'] = this.getTableData(data.right_table,'left',data.is_right_custom);
       });

       let relationNames = this.relationships.map(element => {
          return element.relationship_name.toLowerCase();
        });

        this.relNames.emit(relationNames);
     }, err => {
       this.isLoading = false;
     })
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  deleteRelation(rId : number) {
    Utils.showSpinner();
    this.relationService.deleteRelations(rId).subscribe(res => {
      this.toasterService.success(res['message']);
      Utils.hideSpinner();
      this.getRelations();
    }, err => {
      Utils.hideSpinner();
      this.toasterService.error(err);
    })
  }

  editRelation(event, relation) {
    this.editSelectedRelation.emit(relation);
  }

}