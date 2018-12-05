import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {SemdetailsService} from '../semdetails.service';
 import {AuthenticationService} from '../authentication.service';
import { SemanticLayerMainService } from './semantic-layer-main.service';
import { ToastrService } from 'ngx-toastr';



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
  sidebarFlag : number; columns; view;sel;button;isShow = false;
  public semantic_name;
  public isCollapsed = true;
  public model: any;
  public isLoading: boolean;
  reports = []; 
  selectedTable;

  constructor(private route: Router,private activatedRoute:ActivatedRoute, private semanticLayerMainService:SemanticLayerMainService,  private se:SemdetailsService, private toasterService: ToastrService) { 





    // console.log(this.columns); 
    
    this.se.myMethod$.subscribe((columns) =>  {
      console.log('columns', columns)
    this.columns = columns});
    this.sidebarFlag = 1;
    }
    
    ngOnInit() {
      this.columns = [];
      // console.log(this.route,'route');
      this.semantic_name =this.activatedRoute.snapshot.data['semantic']
      // this.role_nam=this.activatedRoute.snapshot.data['role']
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

  show(i){
    this.button = i; 
    this.isShow = !this.isShow;
  }

  public toggle(type){
    // if(type == 'sidebar'){
       $('#sidebar').toggleClass('active');
      // $('#relationSidebar').addClass('active');
     }
     
  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    public saveTable(obj,type){
      let options = {};
      options['table_id'] = obj.table_id;
      options['sl_id'] = this.activatedRoute.snapshot.data['semantic_id']; 
      if(type == "column"){
         options['old_column_name'] = obj.old_val;
         options['new_column_name'] = obj.table_name;
         this.semanticLayerMainService.saveColumnName(options).subscribe(res => console.log(res));
      }else{
        options['table_name'] = obj.table_name;
        this.semanticLayerMainService.saveTableName(options).subscribe(res => console.log(res));
      }
    }

    public getDependentReports(tableId) { 
      this.isLoading = true;
      this.selectedTable = tableId;
      this.semanticLayerMainService.getReports(tableId).subscribe(response => {
        this.reports = response['dependent_reports'];
        this.isLoading = false;
      }, error => {
          this.toasterService.error(error.message || 'There seeme to be an error. Please try again later.');
      })      
    }
  
    public deleteTable() {   
      this.semanticLayerMainService.deleteTable(this.selectedTable).subscribe(response => {
        this.getTables();
        this.toasterService.success('Table deleted successfully')
      }, error => {
          this.toasterService.error(error.message || 'There seeme to be an error. Please try again later.');
      });
    }

    public getTables(){
      let semantic_id = this.activatedRoute.snapshot.data['semantic_id'];
      this.se.fetchsem(semantic_id).subscribe(response => {
        this.columns = response['sl_table'];
      }, error => {
          this.toasterService.error(error.message || 'There seeme to be an error. Please try again later.');
      })
    }
}
