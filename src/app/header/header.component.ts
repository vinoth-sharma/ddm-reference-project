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
    this.roles=this.arr.user;
    this.roleName=this.arr.role_check;
  }
  

  ngOnInit() {}

  callRolespage() { 
    this.route.navigate(['roles']);
  }

  callLogEntryView() {
    this.route.navigate(['logs']); 
  }

  role() {
      this.route.navigate(['module'])
  }

  modulePageRoute() {
    this.route.navigate(['module'])
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "▲";
    else
      this.buttonName = "▼";
  }

}
