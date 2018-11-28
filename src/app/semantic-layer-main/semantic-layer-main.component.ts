import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {SemdetailsService} from '../semdetails.service';
 import {AuthenticationService} from '../authentication.service';
// Dummy array for search bar
const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-semantic-layer-main',
  templateUrl: './semantic-layer-main.component.html',
  styleUrls: ['./semantic-layer-main.component.css']
})
export class SemanticLayerMainComponent implements OnInit {
  sidebarFlag : number; columns; sel;
button;
isShow = false;
  public semantic_name;
  constructor(private route: Router,  private se:SemdetailsService,) { 
    this.se.myMethod$.subscribe((columns) => 
    this.columns = columns);
    this.se.myMethod$.subscribe((sel) => 
    this.sel = sel);

 
    console.log(this.columns); 
    
    this.sidebarFlag = 1;
    }
  show(i){
    this.button = i;
    this.isShow = !this.isShow;
       }
ngOnInit() {
    this.semantic_name = localStorage.getItem('sl_name');
         $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });
   });
  
  }

  widthSetting(){
    if(this.sidebarFlag == 1){
      document.getElementById('main').style.width = "100%";
      this.sidebarFlag = 0;
    }
    else{
      document.getElementById('main').style.width = "80%";
      this.sidebarFlag = 1;
    }
 ;
  }
  clickHome() {
    document.getElementById('home').style.backgroundColor = "rgb(250, 250, 250)";
    document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
  }

  clickReports() {
    document.getElementById('reports').style.backgroundColor = "rgb(250, 250, 250)";
    document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
  }
  clickSL() {
    document.getElementById('sl').style.backgroundColor = "rgb(250, 250, 250)";
    document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
  }
  clickRMP() {
    document.getElementById('rmp').style.backgroundColor = "rgb(250, 250, 250)";
    document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
  }
  clickDQM() {
    document.getElementById('dqm').style.backgroundColor = "rgb(250, 250, 250)";
    document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
  }
  public isCollapse(event){
if(event.target.parentNode.classList.contains("collapsed")){
  console.log("its collpased");
}
  };

  public isCollapsed = true;

  // Logic for collapsible sidebar
  public model: any;

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
}
