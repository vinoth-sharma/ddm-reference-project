import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-relation-layout',
  templateUrl: './relation-layout.component.html',
  styleUrls: ['./relation-layout.component.css']
})
export class RelationLayoutComponent implements OnInit {

  selected = new FormControl(0);
  enableEditingFlag:boolean = false;
  dataInjected:boolean = true;
  editingData:any;
  relNames:any;

  constructor(private dialogRef: MatDialogRef<RelationLayoutComponent>,) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 relationCreated(event){
   this.dataInjected = false;
   if(event.isEdit) {
    this.enableEditingFlag = false;
   }
   setTimeout(()=>{
    this.dataInjected = true;
    this.selected.setValue(1);
   },0)
 }

 enableEditing(event){
  this.editingData = event;
  this.enableEditingFlag = true;
  this.selected.setValue(2);
 }
 
 getRelNames(names) {
   this.relNames = names;
 }



}
