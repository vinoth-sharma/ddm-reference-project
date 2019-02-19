import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css']
})
export class RmpLandingPageComponent implements OnInit {

  public firstName;
  public lastName; 
  public userInformation; 
  public rolename;  
  
  
    isbuttonVisible:boolean=false;
    
    roles;arr; roleName; 
    
  
 
constructor(private route: Router,  private user:AuthenticationService){
  this.user.myMethod$.subscribe((arr) => 
  this.arr = arr);
  this.roles=this.arr.user;
  this.roleName=this.arr.role_check;
 
}
  
  role() {
    
      console.log('success')
      this.route.navigate(['module'])
      
    }


  ngOnInit() {
  }

}
