import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  arr; roles;roleName;
  private isButtonVisible = true;
  public show:boolean = false;
  public buttonName:any = '▼';

  constructor(private route: Router,  private user:AuthenticationService,private activatedRoute:ActivatedRoute) { 
    this.user.myMethod$.subscribe((arr) => 
    this.arr = arr);
    // this.roles=this.arr.user;
    this.roles= {'first_name': this.arr.first_name,'last_name' : this.arr.last_name};
    this.roleName = { 'role':this.arr.role};
  }
  

  ngOnInit() {}

  callRolespage() { 
    this.route.navigate(['roles']);
  }

  callLogEntryView() {
    this.route.navigate(['logs']); 
  }

  role() {
      this.route.navigate(['user'])
  }

  modulePageRoute() {
    this.route.navigate(['user'])
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "▲";
    else
      this.buttonName = "▼";
  }

  goToLogin(){
    this.route.navigate(['login'])
  }

}
