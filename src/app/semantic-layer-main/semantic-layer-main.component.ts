import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
 import {AuthenticationService} from '../authentication.service';
import { SemanticLayerMainService } from './semantic-layer-main.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-semantic-layer-main',
  templateUrl: './semantic-layer-main.component.html',
  styleUrls: ['./semantic-layer-main.component.css']
})

export class SemanticLayerMainComponent implements OnInit {
  sidebarFlag: number;
  columns;
  view;
  slChoice;
  button;
  isShow = false;
  public semantic_name;
  public isCollapsed = true;
  public model: any;
  public reports = [];
  public selectedTable;

  constructor(private route: Router,private activatedRoute:ActivatedRoute, private semanticLayerMainService:SemanticLayerMainService) { 

    }
    
    ngOnInit() {
      $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
  }

  show(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

}
