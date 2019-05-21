import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AuthSsoService } from '../auth-sso.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private route: Router,
    private authenticationService:AuthenticationService,
    private activatedRoute:ActivatedRoute,
    private authSsoService:AuthSsoService,
    private toastrService: ToastrService) 
    { 
      this.authenticationService.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles= {'first_name': this.arr.first_name,'last_name' : this.arr.last_name};
      this.roleName = { 'role':this.arr.role};
    });
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
    // this.route.navigate(['login'])
    this.authenticationService.logout().subscribe(res => {
      this.authSsoService.deleteToken();
      window.location.href = res['redirect_url'];
      
    },error =>{
      this.toastrService.error(error);
    });
  }

}
