import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css']
})
export class RmpLandingPageComponent implements OnInit {

  public firstName = '';
  public lastName = '';
  public userInformation;
  public rolename = '';
  public isbuttonVisible: boolean = false;
  public roles; arr; roleName;

  constructor(private route: Router, private user: AuthenticationService) {
    this.user.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles = { 'first_name': this.arr.first_name, 'last_name': this.arr.last_name, 'role_id': this.arr.role_id };
      this.roleName = { 'role': this.arr.role };
    });
  }

  role() {
    this.route.navigate(['semantic']);
  }

  ngOnInit() {
  }

}
