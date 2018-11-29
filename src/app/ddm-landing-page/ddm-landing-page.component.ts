import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {SemdetailsService} from '../semdetails.service';
 @Component({
  selector: 'app-ddm-landing-page',
  templateUrl: './ddm-landing-page.component.html',
  styleUrls: ['./ddm-landing-page.component.css']
})
export class DdmLandingPageComponent implements OnInit {

 sem; arr; columns; sls; sel; det;
  // semantic=[{name:'Vehicle Info'},{name:'Pricing Team'},{name:'Vehicle Allocation'}];
  isbutton:boolean=false; 
  public sele;
constructor(private route: Router,  private user:AuthenticationService,  private se:SemdetailsService){
    this.user.myMethod$.subscribe((arr) => 
    this.arr = arr);
    this.sem=this.arr.sls;
  }
  fun(event:any){
    this.isbutton=true;
    this.sel=event.target.value ;
    this.sele =this.sel;
    this.sls=this.sem.find(x=> x.sl_name == this.sel).sl_id;
    console.log(this.sel);
    console.log(this.sls);
    this.se.fetchsem(this.sls).subscribe (
    (res) => {
      localStorage.setItem('sl_id',this.sls);
      localStorage.setItem('sl_name',this.sele);
    this.det=res as object [];
     console.log(this.det);   
     this.columns=res["sl_list"];
     console.log(this.columns); 
     console.log(this.sele);  
     this.se.myMethod(this.sele);
     this.se.myMethod(this.columns);
      
    }
    )}; 
    callSemanticlayer() {
  this.route.navigate(['semantic']);
}
ngOnInit() {
}


}
