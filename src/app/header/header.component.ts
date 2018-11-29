import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  arr; roles;roleName;
  constructor(private user:AuthenticationService) {
    this.user.myMethod$.subscribe((arr) => 
  this.arr = arr);
  this.roles=this.arr.user;
  this.roleName=this.arr.role_check;
   }
   

  ngOnInit() {
  }

}
