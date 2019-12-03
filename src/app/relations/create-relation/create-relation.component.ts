import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import Utils from '../../../utils';
import { Router } from '@angular/router';
// import { ShowRelationsComponent } from '../show-relations/show-relations.component';
import { ToastrService } from 'ngx-toastr';
import { CreateRelationService } from '../create-relation.service';

@Component({
  selector: 'app-create-relation',
  templateUrl: './create-relation.component.html',
  styleUrls: ['./create-relation.component.css']
})
export class CreateRelationComponent implements OnInit {
@Input() isEdit:boolean;
@Input() editData;
@Input() names = [];
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
  primarySearch ='';
  foriegnSearch = '';
  isDuplicate:boolean = false;
  originalRelationNames:any[] = [];
  currentName = '';
  originalRightColumns = [];
  originalTables = [];
  originalLeftColumns = [];
  leftSearch = '';
  rightSearch = '';
  @Output() createEmittor = new EventEmitter();
  @ViewChild('relName') relName = HTMLFormElement;

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
    // this.relationService.getRelations(this.data['semanticId']).subscribe(repsonse =>{
    //   this.originalRelationNames = repsonse['data'].map(element => {
    //     return element.relationship_name.toLowerCase();
    //   })
    // }, err => {
    //   this.toasterService.error(err);
    // });

    this.objectExplorerSidebarService.getTables.subscribe(tables => {
      this.tables['tables'] = Array.isArray(tables) ? (tables && tables.filter(t => t['view_to_admins'])) : [];
      this.tables['tables'] = this.tables['tables'].map(element => {
        element.column_properties = element.column_properties.filter(data => {
          return data.column_view_to_admins;
        })
        return element;
      })
      this.originalTables['tables'] = JSON.parse(JSON.stringify(this.tables['tables']));
      this.resetState();
    });

    this.objectExplorerSidebarService.getCustomTables.subscribe(customTables => {
      this.tables['customTables'] = customTables || [];
      this.originalTables['customTables'] = JSON.parse(JSON.stringify(this.tables['customTables']));
    })
  }

  ngOnChanges() {
    if(this.isEdit)
    setTimeout(()=>{
    this.assignEditdata();
  },0)
  }

  assignEditdata () {
    this.leftTable = this.editData['left_table'];
    this.setSelectedTable(this.editData['left_table'],'left');
    this.rightTable = this.editData['right_table'];
    this.setSelectedTable(this.editData['right_table'],'right');
    this.joinKey = this.editData['type_of_join'];
    this.keys = this.editData['relationships_list'].map(data => {
      return {'primaryKey': data.primary_key,'operator': data.operator,'foriegnKey': data.foreign_key}
    });
    this.relationship_id = this.editData['relationship_table_id'];
    this.relation.name = this.editData['relationship_name'];
    this.currentName = this.editData['relationship_name'];
    this.relation.desc = this.editData['relationship_desc'];;    
    this.checkValidate();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetState() {
    this.joins = ['Left Outer','Right Outer','Full Outer','Inner','Cross'];
    this.keys = [{'primaryKey': '','operator':'=','foriegnKey':''}];
    this.operators = ['=','!='];
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
      this.originalLeftColumns = JSON.parse(JSON.stringify(this.LeftColumns));
    } else {
      this.rightColumns = columns;
      this.keys.forEach(data => data.foriegnKey = '');
      this.originalRightColumns = JSON.parse(JSON.stringify(this.rightColumns));
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
    if(!this.isEdit) {
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

    this.relationService.createRelations(option,this.isEdit).subscribe(res => {
      Utils.hideSpinner();
      this.toasterService.success(res['message']);
      this.leftTable = '';
      this.rightTable ='';
      this.joinKey = '';
      this.keys = 
       [{'primaryKey': '','operator': '=','foriegnKey': ''}]
      this.relationship_id = '';
      this.relation.name = '';
      this.relation.desc = '';
      this.createEmittor.emit({'isEdit': this.isEdit});
    },
    err => {
      this.toasterService.error(err);
      Utils.hideSpinner();
    }
  )
  }

  addRow() {
    this.keys.push({'primaryKey': '','operator':'=','foriegnKey':''});
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

  checkDuplicate(name) {
    if(this.names.length && this.names.includes(name.toLowerCase()) && name.toLowerCase() !== this.currentName.toLowerCase()) {
      this.relName['control'].setErrors({'incorrect': true});
    }else {
      this.relName['control'].setErrors(null);
    }
  }

  filterKey(search, key) {
    if(key === 'primary') {
      if(!search) {
        this.LeftColumns =  JSON.parse(JSON.stringify(this.originalLeftColumns));
        return;
      }else {
        search = search.toLowerCase();
      }
  
      this.LeftColumns = this.originalLeftColumns.filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
   } else {
      if(!search) {
        this.rightColumns =  JSON.parse(JSON.stringify(this.originalRightColumns));
        return;
      }else {
        search = search.toLowerCase();
      }
  
      this.rightColumns = this.originalRightColumns.filter(
        column => column['column'].toLowerCase().indexOf(search) > -1
      )
    }
  }

  filterTable(search) {
      if(!search) {
        this.tables['tables'] = JSON.parse(JSON.stringify(this.originalTables['tables']));
        this.tables['customTables'] = JSON.parse(JSON.stringify(this.originalTables['customTables']));
        this.tables['customTables'] = this.tables['customTables'].filter(i=>i.view_to_admins)
        console.log("This.tables : in filterTable() : ",this.tables);
        
        // this.getTables(); use this if tables not updating
        this.getFavoriteSortedTables('customTables');
        // this.getTables();
        this.getFavoriteSortedTables('tables');
        // this.noEntriesFoundTable = true;
        return;
      }else {
        search = search.toLowerCase();
      }
  
      for(let key in this.originalTables) {
        let tables = this.originalTables[key].filter(
          table => ((table['custom_table_name'] && table['custom_table_name'].toLowerCase()) || (table['mapped_table_name'] && table['mapped_table_name'].toLowerCase())).indexOf(search) > -1
        )
        this.tables[key] = tables;
      }
  }

  isOpened(event,type) {
    if( type === 'primary') {
      this.filterKey('',type);
      this.primarySearch = '';
    } else if(type === 'foriegn'){
      this.filterKey('', type);
      this.foriegnSearch = '';
    } else {
      this.filterTable('');
      this.leftSearch = '';
      this.rightSearch = '';
    }
  }

  public getFavoriteSortedTables(value){
    // console.log("getFavoriteSortedTables() is called!!");
    
    if(this.tables){ 
    let finalFavNonFavTables = [];
      let differeniator = value; 

      let lengthValue;
      if(value == 'tables'){
        lengthValue = this.tables['tables'].length;
      }
      else{
        lengthValue = this.tables['customTables'].length;
      }
      
      let selectedValues = this.tables[differeniator]
      // let selectedValues = this.selectedTables[0].tables[differeniator]
      // let duplicateValues = [...selectedValues]; 

      if(selectedValues){ // if selcted values?

      selectedValues = Array.isArray(selectedValues) ? selectedValues : [];
      // let originalTables = JSON.parse(JSON.stringify(selectedValues));
      
      let selector;
      if(value == 'tables'){
        selector = 'mapped_table_name';
      }
      else if(value == 'customTables'){
        selector = 'custom_table_name';
      }
      // else if(value == 'related tables'){
      //   selector = 'relationship_name';
      // }

      selectedValues.sort(function (a, b) {
        a = a[selector].toLowerCase();
        b = b[selector].toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });

      let favTab = selectedValues.filter(i=>i.is_favourite)
      let favTabSorted = favTab.sort(function (a, b) {
        a = a[selector].toLowerCase();
        b = b[selector].toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 

      let nonFavTab = selectedValues.filter(i=>i.is_favourite === false)
      let nonFavTabSorted = nonFavTab.sort(function (a, b) {
        a = a[selector].toLowerCase();
        b = b[selector].toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 

      let favTabSortedCopy = favTabSorted;
      Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted);
      // let finalFavNonFavTables = favTabSortedCopy;

      if(value == 'tables'){
        this.tables['tables'] = favTabSortedCopy;
      }
      else if(value == 'customTables'){
        this.tables['customTables'] = favTabSortedCopy;
      }
      // console.log(favTabSortedCopy, 'favTabSortedCopy------------');
      // else if(value == 'custom tables'){
      //   this.selectedTables[0].tables['related tables'] = favTabSortedCopy
      // }

      // this.selectedTablesInitial = this.selectedTables;
    }
  }
  else{
    // do nothing
  }

  }

}
