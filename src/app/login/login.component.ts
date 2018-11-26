import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users = [];
  username;
  password;
  firstname;
  successMsg: boolean;
  url: string;
  firstName;
  userData;
  lastName;
  public roleId;
  roleName;
  userIdentification = {};
  public userid;
  loading;
  public slid; arr; semdet; roles; 

  constructor(private http: Http, private toastr: ToastrService, private user:AuthenticationService,private router:Router) { 
    this.users=this.user.userData;
    this.successMsg= false;
    console.log(this.users);
      } 
   
   private messageSource = new BehaviorSubject('default message') 
        currentMessage = this.messageSource.asObservable(); 

    public getUserInformation(){
    // console.log(this._url);
    this.user.fun(this.userid).subscribe (
      (res) => {
        this.arr=res as object [];
       console.log(this.arr);   
       this.semdet=res["sls"];
       this.roleName =res["role_check"];
       this.roles=res["user"];
        console.log(this.roles);
       console.log(this.semdet);
     
        this.router.navigate(['user']);
        
        this.user.myMethod(this.arr);
        console.log(this.roles);
        console.log(this.roleName)
        }, 
      (error) => {console.log("FAILURE") } );
    };
loginUser(){
        this.userid=this.username;
        this.loading = true;
        console.log(this.userid);
        event.preventDefault();
      if(this.users.find(us=> (us.username == this.username && us.password == this.password)))
        {
          console.log('success')
          this.user.SetUserDetails();
          this.getUserInformation();
          this.loading = true;
          this.toastr.success('Logged in successfully');
        }
      else {
          console.log('failure');
          this.toastr.error('Login failed');
          this.loading = false;
        }
  }

  ngOnInit() {
  }

  

}