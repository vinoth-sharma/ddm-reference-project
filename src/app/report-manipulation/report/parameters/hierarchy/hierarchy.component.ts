import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hierarchy-parameter',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {

  public hierarchy:number[] = [1];
  public selectedHierarchy:any[] = [];
  public paramIndex:number;
  @Input() parameters;
  @Output() save = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  add(index){
    this.hierarchy.push(this.hierarchy.length + 1);
    
  }

  onSelectHierarchy(index,event){
    let data = {
      parameter_id : event.value,
      hierarchy : index + 1
    }
    this.selectedHierarchy.splice(index, 1, data);
    this.paramIndex = index;
  }

  create(){
    let data = {
      'hierarchy_list' : this.selectedHierarchy
    }
    this.save.emit(data);
  }
}
