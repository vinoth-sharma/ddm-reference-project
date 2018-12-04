import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
<<<<<<< Updated upstream
  arr; roles;roleName;
=======
   arr; roles;roleName;
>>>>>>> Stashed changes
  // constructor(private user:AuthenticationService) {
  //   this.user.myMethod$.subscribe((arr) => 
  // this.arr = arr);
  // this.roles=this.arr.user;
  // this.roleName=this.arr.role_check;
  //  }
   

<<<<<<< Updated upstream
  constructor(private route: Router,  private user:AuthenticationService) { 
       this.user.myMethod$.subscribe((arr) => 
  this.arr = arr);
  this.roles=this.arr.user;
  this.roleName=this.arr.role_check;
  }
=======
  constructor(private route: Router,  private user:AuthenticationService) {
    this.user.myMethod$.subscribe((arr) => 
  this.arr = arr);
  this.roles=this.arr.user;
  this.roleName=this.arr.role_check;
   }
>>>>>>> Stashed changes

  callRolespage() {
    this.route.navigate(['roles']);
    }

    role() {
  
      console.log('success')
      this.route.navigate(['module'])
      
    }

    modulePageRoute() {
  
      console.log('success')
      this.route.navigate(['module'])
      
    }
    
  ngOnInit() {
  }


}
