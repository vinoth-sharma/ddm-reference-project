import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-ddm-landing-page',
  templateUrl: './ddm-landing-page.component.html',
  styleUrls: ['./ddm-landing-page.component.css']
})
export class DdmLandingPageComponent implements OnInit {

  semnames:any;
  semantic=[{name:'Vehicle Info'},{name:'Pricing Team'},{name:'Vehicle Allocation'}];
  isbutton:boolean=false;


  constructor(private _auth:AuthenticationService, private route: Router ) { }
  fun($event){
    this.isbutton=true;
  };

callSemanticlayer() {
  this.route.navigate(['semantic']);
  console.log('yaay');
}

ngOnInit() {
}


}
