import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import * as $ from 'jquery';
import { constants_value } from '../../constants';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit{

  @Input() data: string[];
  @Input() styles: {};
  @Input() index;
  @Input() allowAlias: boolean;
  @Output() optionSelected = new EventEmitter()
  @Input() selectedColumns: string[];
  @Input() aliasNames:any; 

  filteredData: string[] = [];
  hideMenu: boolean = false;
  optionsMap: object[] = [];
  selectedValues: string[] = [];
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges){
    // console.log(changes);
    if(this.data && changes['data'])
      this.columnsUpdated();
    this.selectionUpdated(changes);
    }

  columnsUpdated(){
    this.filteredData = [];
    this.optionsMap = [];
    // Copying input data so that it doesnt get mutated while searching
    this.filteredData = [...this.data];
    // Creating the mapped object to store aliasName and checked value to true or false
    this.filteredData.map((datum) => {
      let tempObj = {};
      tempObj['aliasName'] = "";
      tempObj['checked'] = false;
      this.optionsMap[datum] = tempObj;
    });
    this.filteredData = this.filteredData.sort(); // sorting 
  }

  selectionUpdated(changes){
    if(this.selectedColumns && changes['selectedColumns'])
      this.updatedChecked();
    if(this.aliasNames && changes['aliasNames'])
      this.updateAliasNames();
  }

  //update by default checked
  updatedChecked(){
    this.selectedColumns = this.selectedColumns.filter(ele=> this.filteredData.some(filt=> filt.toLowerCase() === ele.toLowerCase()) )
    this.selectedColumns.forEach(selected=>{
      this.optionsMap[selected].checked = true;
    })
    this.updateSelectedValues();
  }

  //update by default alias names
  updateAliasNames(){
    let elements = Object.keys(this.aliasNames);
    elements.forEach(alias=>{
      this.optionsMap[alias].aliasName = this.aliasNames[alias];
    })
  }

  //The displayed values in chips format: Updating that array 
  updateSelectedValues() {
    this.selectedValues.length = 0;
    this.data.map((datum) => {
      if(this.optionsMap[datum]['checked']) {
        this.selectedValues.push(datum);
      }
    })
  }

  // Updating select all checkbox based on multiple conditions
  updateSelectAll() {
    let checkSelectAll = this.filteredData.map((datum) => this.optionsMap[datum]['checked']);
    // console.log(checkSelectAll,checkSelectAll.indexOf(false));
    let ele = document.getElementById("selectAllCb"+ "_" +this.index) as HTMLInputElement;
    // if(checkSelectAll.indexOf(false) === -1){
    //   ele.checked = true;
    // } else {
    //   ele.checked = false;
    // }
    if(checkSelectAll.indexOf(false) !== -1 || checkSelectAll.length === 0){
      ele.checked = false;
    } else {
      ele.checked = true;
    }
    this.updateSelectedValues();
  }

  // updating options display array while searching
  updateOptions(searchValue) {
    this.filteredData = [...this.data];
    this.filteredData = [...this.filteredData.filter((el) => {
      return el.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    })];
    this.filteredData =  this.filteredData.sort();
    this.updateSelectAll()
  }

  // function to trigger while seacrh value is being entered: for each keyup event
  startSearch(event){
    // let searchValue = $('#searchField')[0].innerHTML;
    let searchValue = event.srcElement.innerText;
    if (searchValue !== "") {
      this.updateOptions(searchValue);
    } else{
      this.filteredData = [...this.data];
      this.filteredData =  this.filteredData.sort();
      this.updateSelectAll();
    }
  }

  // Toggle between selectAll and unselectAll state
  selectAllToggle() {
    let ele = document.getElementById("selectAllCb" + "_" + this.index) as HTMLInputElement;

    this.filteredData.map((datum) => {
      this.optionsMap[datum]['checked'] = ele.checked;
    });
    this.filteredData =  this.filteredData.sort();
    this.updateSelectedValues();
    this.optionSelected.emit(this.optionsMap)
  }

  // function to trigger on toggle of each option
  toggleEach(option){
    // console.log(option);
   // console.log(this.index);
    this.optionsMap[option]['checked'] = !this.optionsMap[option]['checked'];
    this.updateSelectAll();
    this.optionSelected.emit(this.optionsMap)
  }

  client = {
    x: 'auto',
    y: 'auto'
  }

  selectClicked(eve){
    // console.log(eve);
    if(this.data?this.data.length:false){
      this.client.x = (eve.clientX - eve.layerX - 10) + 'px';
      this.client.y = (eve.clientY - eve.layerY - 10) + 'px';
      this.hideMenu = true;
    setTimeout(() => {
      this.updateSelectAll();
    }, 0);
  }
  }

  closeDropDown(){
    this.startSearch({ srcElement: { innerText : "" } }  )
    this.hideMenu = false;
  }

  inputAlias(ele,value){
    ele['aliasName'] = value;
    // console.log(event);
    this.optionSelected.emit(this.optionsMap)
  }

  getTitle(arr){
    return arr.map(element => {
      let regex = new RegExp(constants_value.column_space_replace_value,"gi")
      return element.replace(regex," ")
    });
  }
}
