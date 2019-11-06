import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {

  @Input() data: string[];
  @Input() styles: {};
  @Input() allowAlias: boolean;
  @Output() optionSelected = new EventEmitter()
  
  filteredData: string[] = [];
  hideMenu: boolean = true;
  optionsMap: object[] = [];
  selectedValues: string[] = [];
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(){
    // Copying input data so that it doesnt get mutated while searching
    this.filteredData = [...this.data];
    // Creating the mapped object to store aliasName and checked value to true or false
    this.filteredData.map((datum) => {
      let tempObj = {};
      tempObj['aliasName'] = "";
      tempObj['checked'] = false;
      this.optionsMap[datum] = tempObj;
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
    let ele = document.getElementById("selectAllCb") as HTMLInputElement;
    if(checkSelectAll.indexOf(false) === -1){
      ele.checked = true;
    } else {
      ele.checked = false;
    }
    this.updateSelectedValues()
  }

  // updating options display array while searching
  updateOptions(searchValue) {
    this.filteredData = [...this.data];
    this.filteredData = [...this.filteredData.filter((el) => {
      return el.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    })];
    this.updateSelectAll()
  }

  // function to trigger while seacrh value is being entered: for each keyup event
  startSearch() {
    let searchValue = $('#searchField')[0].innerHTML
    if (searchValue !== "") {
      this.updateOptions(searchValue);
    } else {
      this.filteredData = [...this.data];
      this.updateSelectAll()
    }
  }

  // Toggle between selectAll and unselectAll state
  selectAllToggle() {
    let ele = document.getElementById("selectAllCb") as HTMLInputElement;

    this.filteredData.map((datum) => {
      this.optionsMap[datum]['checked'] = ele.checked;
    })
    this.updateSelectedValues()
    this.optionSelected.emit(this.optionsMap)
  }

  // function to trigger on toggle of each option
  toggleEach(option) {
    this.optionsMap[option]['checked'] = !this.optionsMap[option]['checked'];
    this.updateSelectAll();
    this.optionSelected.emit(this.optionsMap)
  }

  client = {
    x: 'auto',
    y: 'auto'
  }

  selectClicked(eve){
    console.log(eve);
    if(this.data.length){
      this.hideMenu = false;
      this.client.x = (eve.clientX - eve.layerX - 10) + 'px';
      this.client.y = (eve.clientY - eve.layerY - 10) + 'px';
    }
  }

  closeDropDown(){
    this.hideMenu = true;
  }

}
