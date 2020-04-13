import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// import { DataProviderService } from "../rmp/data-provider.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users = [];
  username;
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
  public isDisabled = false;

  constructor( private user:AuthenticationService,private router:Router) { 
    // this.users=this.user.userData;
    // this.successMsg= false;
    // //console.log(this.users);
      } 
   
   private messageSource = new BehaviorSubject('default message') 
        currentMessage = this.messageSource.asObservable(); 

    // public getUserInformation(){
    // this.user.fun(this.userid).subscribe (
    //   (res) => {
    //     this.arr=res as object [];
    //   //  //console.log("getting data for the user",this.arr);   
    //    this.semdet=res["sls"];
    //    this.roleName =res["role_check"];
    //    this.roles=res["user"];
    //    this.router.navigate(['user']);
    //   //  this.spinner.show();
    //   //  this.dataProvider.loadLookUpData().then(()=>{
    //   //   //console.log("done")
    //   //   this.dataProvider.loadLookUpTableData().then(()=>{
    //   //     //console.log("done2")
    //   //     this.spinner.hide();
    //   //   })
    //   // })
    //     // //console.log(this.roles);
    //   //  //console.log(this.semdet);
     
        
    //     this.user.myMethod(this.arr, this.userid);
    //     this.user.errorMethod(this.userid);
    //     // //console.log(this.roles);
    //     // //console.log(this.roleName)
    //     }, 
    //   (error) => {//console.log("FAILURE") } );
    // };
  //   loginUser(event?:any){
  //       this.userid=this.username;
  //       this.loading = true;
  //       // //console.log(this.userid);
  //       this.user.userId = this.userid;
  //       event.preventDefault();
  //     if(this.users.find(us=> (us.username == this.username && us.password == this.password)))
  //       {
  //         //console.log('success')
  //         this.user.SetUserDetails();
  //         this.getUserInformation();
  //         this.loading = true;
  //         this.toastr.success('Logged in successfully');
  //         this.isDisabled = true;
  //       }
  //     else {
  //         //console.log('failure');
  //         this.toastr.error('Login failed');
  //         this.loading = false;
  //       }
  // }

  ngOnInit() {
  }

  

}