import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AuthSsoService } from '../auth-sso.service';
import { ToastrService } from 'ngx-toastr';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import Utils from '../../utils';
import { NgToasterComponent } from '../custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.comp.css']
})
export class HeaderComponent implements OnInit {
  arr; roles;roleName;
  private isButtonVisible = true;
  public show:boolean = false;
  public buttonName:any = '▼';
  user_role: any;
  user_name: string;
  notification_list: any[];
  notification_number: any;
  notification_set: Set<any>;

  constructor(
    private route: Router,
    private authenticationService:AuthenticationService,
    private activatedRoute:ActivatedRoute,
    private authSsoService:AuthSsoService,
    private toastrService: NgToasterComponent,
    private dataProvider:DataProviderService) 
    { 
      this.subscribeToService()
  }
  
  subscribeToService(){
    this.authenticationService.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles= {'first_name': this.arr.first_name,'last_name' : this.arr.last_name};
      this.roleName = { 'role':this.arr.role};
    });
    this.authenticationService.myMethod$.subscribe(role =>{
      if (role) {
        this.user_role = role["role"]
        this.dataProvider.currentNotifications.subscribe((element:Array<any>) => {
          if (element) {
                this.user_name = role["first_name"] + "" + role["last_name"]
                this.user_role = role["role"]
                this.notification_list = element.filter(element => {
                return element.commentor != this.user_name
                })
                var setBuilder = []
                this.notification_list.map(element => { 
                  setBuilder.push(element.ddm_rmp_post_report)
                })
                this.notification_set = new Set(setBuilder) 
                this.notification_number = this.notification_set.size
          }
        })
      }
    })
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

  // toggle() {
  //   this.show = !this.show;
  //   if(this.show)  
  //     this.buttonName = "▲";
  //   else
  //     this.buttonName = "▼";
  // }

  // goToLogin(){
  //   this.authenticationService.logout().subscribe(res => {
  //     this.authSsoService.deleteToken();
  //     window.location.href = res['redirect_url'];
      
  //   },error =>{
  //     this.toastrService.error(error);
  //   });
  // }

  redirect(value:string){
    console.log('CLICKED HELP SECTION is :',value);
    Utils.showSpinner();
    this.authenticationService.getHelpRedirection(value).subscribe(res=>{
      let pdfFile = new Blob([res], {type: 'application/pdf'});
      const data = window.URL.createObjectURL(pdfFile);
      Utils.hideSpinner();
      window.open(data);
    })
  }
}