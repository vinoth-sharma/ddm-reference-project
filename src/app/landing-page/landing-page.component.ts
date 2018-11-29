import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  public firstName;
  public lastName; 
  public userInformation; 
  public rolename;  
  
  
    isbuttonVisible:boolean=false;
    
    roles;arr; roleName; 
    
  
 
constructor(private route: Router,  private user:AuthenticationService,private activatedRoute:ActivatedRoute)
{
  this.user.myMethod$.subscribe((arr) => 
  this.arr = arr);
  this.roles=this.arr.user;
  this.roleName=this.arr.role_check;
  this.route.config.forEach(element => {
    if(element.path == 'role'){
      element.data['role'] = this.roleName;
    }
  });
  
  this.activatedRoute.snapshot.data['role'] = this.roleName;
   console.log( this.activatedRoute.snapshot.data['role']); 
}
  rolem() {
      console.log('success'),
      this.route.navigate(['module'])
      
    }
  
  
  
   ngOnInit() {
    
      }
  }
  
