import { Component, OnInit, Inject } from '@angular/core';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import Utils from '../../../utils';
import { Router } from '@angular/router';
import { ShowRelationsComponent } from '../show-relations/show-relations.component';
import { ToastrService } from 'ngx-toastr';
import { CreateRelationService } from '../create-relation.service';

@Component({
  selector: 'app-create-relation',
  templateUrl: './create-relation.component.html',
  styleUrls: ['./create-relation.component.css']
})
export class CreateRelationComponent implements OnInit {

  tables = {};
  joins:any[] = [];
  keys:any[] = [];
  LeftColumns:any[] = [];
  rightColumns:any[] = [];
  operators:any[] = [];
  joinKey:string = '';
  leftTable;
  rightTable;
  diffDataType:boolean = false;
  type:string = '';
  relationship_id;
  relation:any = {
    'name': '',
    'desc': ''
  };

  constructor(
    private router:Router,
    private relationService:CreateRelationService,
    private dialogRef: MatDialogRef<CreateRelationComponent>,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private dialog: MatDialog,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = Array.isArray(tables) ? tables : [];
      this.resetState();
    });

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['customTables'] = customTables || [];
    })

    this.assignEditdata();
  }

  assignEditdata () {
    this.type = this.data['type'];
    this.leftTable = this.data['relation']['left_table'];
    this.setSelectedTable(this.data['relation']['left_table'],'left');
    this.rightTable = this.data['relation']['right_table'];
    this.setSelectedTable(this.data['relation']['right_table'],'right');
    this.joinKey = this.data['relation']['type_of_join'];
    this.keys = this.data['relation']['relationships_list'].map(data => {
      return {'primaryKey': data.primary_key,'operator': data.operator,'foriegnKey': data.foreign_key}
    });
    this.relationship_id = this.data['relation']['relationship_table_id'];
    this.relation.name = this.data['relation']['relationship_name'];
    this.relation.desc = this.data['relation']['relationship_id'];;    
    this.checkValidate();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetState() {
    this.joins = ['Left Outer','Right Outer','Full Outer','Inner','Cross'];
    this.keys = [{'primaryKey': '','operator':'','foriegnKey':''}];
    this.operators = ['=','!='];
    this.type = this.data['type'];
  }

  isCustomTable(selected: any) {
  return this.tables['customTables'].map(table => table['custom_table_id']).includes(selected);
  }

  setSelectedTable(data:any, type:string) {
    let columns;

    if(this.isCustomTable(data)){
      columns = this.tables['customTables'].find(table => data === table['custom_table_id'])['column_properties'];
    }else {
      columns = this.tables['tables'].find(table => data === table['sl_tables_id'])['column_properties'];
    }

    if(type === 'left') {
      this.LeftColumns = columns;
      this.keys.forEach(data => data.primaryKey = '');
    } else {
      this.rightColumns = columns;
      this.keys.forEach(data => data.foriegnKey = '');
    }

  }

  setSelectedColumn(data:any, type:string, columnIndex) {
    let rightIndex = this.rightColumns.filter(item => item['column'].toLowerCase() === data.foriegnKey.toLowerCase());
    let leftIndex = this.LeftColumns.filter(item => item['column'].toLowerCase() === data.primaryKey.toLowerCase());
    if(rightIndex.length && leftIndex.length && rightIndex[0].data_type === leftIndex[0].data_type) {
      data.diffDataType = false;
    } else {
      data.diffDataType = true;
    }
    this.checkValidate();
  }

  getData(type) {
    return this.keys.map(data => {
      return data[type];
    });
  }

  onCreate() {
    Utils.showSpinner();
    let option = {};
    let joinType = this.joinKey;
    let leftTableId = this.leftTable;
    let rightTableId = this.rightTable;
    if(this.type === 'create') {
      option['sl_id'] = this.data['semanticId'];
      option['relationship_obj'] = {
        'join_type': joinType,
        'left_table_id': leftTableId,
        'right_table_id': rightTableId,
        'primary_key': this.getData('primaryKey'),
        'foreign_key': this.getData('foriegnKey'),
        'operator': this.getData('operator'),
        'is_left_custom': this.isCustomTable(leftTableId),
        'is_right_custom': this.isCustomTable(rightTableId),
        'relationship_name': this.relation.name,
        'relationship_desc': this.relation.desc
      }
    } else {
      option['relationship_table_id'] = this.relationship_id,
      option['join_type'] = joinType,
      option['left_table_id'] =leftTableId,
      option['right_table_id'] = rightTableId,
      option['primary_key'] =  this.getData('primaryKey'),
      option['foreign_key'] = this.getData('foriegnKey'),
      option['operator'] = this.getData('operator'),
      option['is_left_custom'] = this.isCustomTable(leftTableId),
      option['is_right_custom'] = this.isCustomTable(rightTableId),
      option['relationship_name'] = this.relation.name,
      option['relationship_desc'] = this.relation.desc
    }

    this.relationService.createRelations(option,this.type).subscribe(res => {
      Utils.hideSpinner();
      this.toasterService.success(res['message']);
      this.dialogRef.close();
    },
    err => {
      this.toasterService.error(err);
      Utils.hideSpinner();
    }
  )
  }

  addRow() {
    this.keys.push({'primaryKey': '','operator':'','foriegnKey':''});
  }

  deleteRow(i) {
    this.keys.splice(i,1);
    this.checkValidate();
  }

  checkOneRelation() {
    return this.keys.length === 1;
  }

  checkValidate() {
    this.diffDataType = false;
    let result = this.keys.map(data => {
      let rightIndex = this.rightColumns.filter(item => item['column'].toLowerCase() === data.foriegnKey.toLowerCase());
      let leftIndex = this.LeftColumns.filter(item => item['column'].toLowerCase() === data.primaryKey.toLowerCase());
      if(rightIndex.length && leftIndex.length && rightIndex[0].data_type !== leftIndex[0].data_type) {
        this.diffDataType = true;
      }
    });
  }

  showRelationships() {
    // const dialogRef = this.dialog.open(ShowRelationsComponent, {
    //   width: '800px',
    //   height: 'auto',
    //   minHeight: '285px',
    //   data: {'semanticId':this.data['semanticId']}
    // })

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //     this.type = result['type'];
    //     this.leftTable = result['relation']['left_table'];
    //     this.setSelectedTable(result['relation']['left_table'],'left');
    //     this.rightTable = result['relation']['right_table'];
    //     this.setSelectedTable(result['relation']['right_table'],'right');
    //     this.joinKey = result['relation']['type_of_join'];
    //     this.keys = result['relation']['relationships_list'].map(data => {
    //       return {'primaryKey': data.primary_key,'operator': data.operator,'foriegnKey': data.foreign_key}
    //     });
    //     this.relationship_id = result['relation']['relationship_table_id'];
    //     this.checkValidate();
    //   }
    // })
    this.dialogRef.close({'semanticId':this.data['semanticId']});
  }
}
