import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hierarchy-parameter',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {

  public hierarchy:any[] = [];
  public selectedHierarchy:any[] = [];
  public paramIndex:number;
  @Input() parameters;
  @Output() save = new EventEmitter;

  public isDisable;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
   this.reset();
  }

  add(index){
    let selectedParams = [];
    this.parameters.forEach(element => {
      let isFound = false;
      this.selectedHierarchy.forEach(h => {
        if(h.parameters_id == element.parameters_id){
          isFound = true;
        }
      });
      if(!isFound){
        selectedParams.push(element);
      }
    });
    this.hierarchy[index]['isDisabled'] = true;
    this.hierarchy.push({
      'index':this.hierarchy.length + 1,
      'parameters': selectedParams
    });
  }

  onSelectHierarchy(index,event){
    event['value'].hierarchy = index + 1;
    this.selectedHierarchy.splice(index, 1, event.value);
    this.paramIndex = index;
    if(this.hierarchy.length < 2){
      this.isDisable = true;
    }else{
      this.isDisable = false;
    }
  }

  create(){
    let selected = this.selectedHierarchy.map(ele => {
      return {
        parameter_id : ele.parameters_id,
        hierarchy :  ele.hierarchy
      }
    })
    
    let data = {
      'hierarchy_list' : selected
    }
    this.save.emit(data);
  }

  reset(){

    let paramList = this.parameters.filter(ele => {
      return !ele.isDisabled;
    });
    this.hierarchy = [{
      'index': 1,
      'parameters': paramList
    }];
    this.selectedHierarchy = [];
    this.isDisable = true;
  }
  
}
