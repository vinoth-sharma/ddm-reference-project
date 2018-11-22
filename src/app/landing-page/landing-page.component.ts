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
    
    roles;
    // roles = [{role:'Admin'},
    //   {role:'Non-admin'},
    //   {role:'Viewers'}
    // ];
    
  
  constructor(private route: Router,  private user:AuthenticationService){
    this.user.myMethod$.subscribe((userInformation) => 
    this.userInformation = userInformation);
    this.roles =[{roleid: this.userInformation[2], rolename: this.userInformation[1] }];
  }
  
  role() {
    
      console.log('success')
      this.route.navigate(['module'])
      
    }
  
    role_console() {
      console.log('success');
      console.log(this.userInformation);
    }
  
   ngOnInit() {
    console.log(this.userInformation[2]);
      }
  }
  
