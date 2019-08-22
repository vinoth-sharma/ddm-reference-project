import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NewRelationModalService } from '../../new-relation-modal/new-relation-modal.service';
import Utils from '../../../utils';
import { ToastrService } from 'ngx-toastr';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';

@Component({
  selector: 'app-show-relations',
  templateUrl: './show-relations.component.html',
  styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

  relationships:any[] = [];
  isLoading:boolean = true;
  tables:any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ShowRelationsComponent>,
    private relationService:NewRelationModalService,
    private dialog: MatDialog,
    private objectExplorerSidebarService:ObjectExplorerSidebarService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables = Array.isArray(tables) ? tables : [];
    });
   this.getRelations();
  }

  getTableData(tableId, type) {
    return this.tables.filter(data => {
      return data.sl_tables_id === tableId;
    })[0].mapped_table_name;
  }

  getRelations() {
     this.isLoading = true;
     Utils.closeModals();
     this.relationService.getRelations( this.data.semanticId).subscribe(res => {
       this.isLoading = false;
       this.relationships = res['data'];
       this.relationships.forEach(data => {
         data['left_table_name'] = this.getTableData(data.left_table,'left');
         data['right_table_name'] = this.getTableData(data.right_table,'left');
       });
     }, err => {
       this.isLoading = false;
     })
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  deleteRelation(rId) {
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

  editRelation(relation) {
    this.dialogRef.close({'relation':relation,'type':'edit'});
  }

}