import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import Utils from '../../utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.comp.css']
})
export class HeaderComponent implements OnInit {
  public arr: any = [];
  public roles: any = {};
  public roleName: any = {};
  public show: boolean = false;
  public user_role: any;
  public user_name: string;
  public notification_list: any[];
  public notification_number: any;
  public notification_set: Set<any>;
  public sortedNotification = []
  public redNotificationList = []
  public unreadNotificationList = []
  public redTraker = [];
  public unreadTraker = [];

  public routerObj = [{
    label: "Main Menu",
    routerVal: "main",
    isVisible: true,
    isActive: true
  }, {
    label: "Submit Request",
    routerVal: "disclaimer",
    isVisible: true,
    isActive: false
  }, {
    label: "Request Status",
    routerVal: "request-status",
    isVisible: true,
    isActive: false
  }, {
    label: "Reports",
    routerVal: "reports",
    isVisible: true,
    isActive: false
  }, {
    label: "Metrics",
    routerVal: "metrics",
    isVisible: false,
    isActive: false
  }]

  constructor(private route: Router,
    private authenticationService: AuthenticationService,
    private dataProvider: DataProviderService) {
    this.subscribeToService()
    dataProvider.loadNotifications()
    // this.subscribeToService();
    route.events.subscribe((val) => {
      // console.log(val);
      if (val instanceof NavigationEnd) {
        // Hide loading indicator
        this.routerObj.forEach(ele => {
          if (val.urlAfterRedirects.includes(ele.routerVal))
            ele.isActive = true;
          else if (ele.routerVal === "disclaimer" && val.urlAfterRedirects.includes("submit-request"))
            ele.isActive = true;
          else
            ele.isActive = false;
        })
      }
    });
  }
  // subscribe to observables in authenticationservice and dataProvider service 
  // to get user info and notification details
  public subscribeToService() {
    this.authenticationService.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles = { 'first_name': this.arr.first_name, 'last_name': this.arr.last_name };
      this.roleName = { 'role': this.arr.role };
    });
    this.authenticationService.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
        this.dataProvider.currentNotifications.subscribe((element: Array<any>) => {
          if (element) {
            this.user_name = role["first_name"] + " " + role["last_name"]
            this.user_role = role["role"];
            if (this.user_role === "Admin")
              this.routerObj[4].isVisible = true;
            // this.notification_list = element.filter(element => {
            //   return element.commentor != this.user_name
            // })
            // this.user_role = role["role"]
            this.notification_list = element;
            let unread = [];
            let red = [];
            this.notification_list.map(item => {
              if (item.comment_read_flag == true) {
                red.push(item)
              } else {
                unread.push(item)
              }
            })
            this.notification_list = unread.concat(red)
            this.sortNotification(this.notification_list)
          }
        })
      }
    })
  }

  ngOnInit() { }

  public role() {
    this.route.navigate(['user'])
  }

  public modulePageRoute() {
    this.route.navigate(['user'])
  }
  // open downloaded pdf in a new window
  public redirect(value: string) {
    Utils.showSpinner();
    this.authenticationService.getHelpRedirection(value).subscribe(res => {
      let pdfFile = new Blob([res], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(pdfFile);
      Utils.hideSpinner();
      window.open(data);
    })
  }
//  creating data set to consolidate notification messages
  sortNotification(notificationList){
  this.redNotificationList = []
  this.unreadNotificationList = []
  this.redTraker = [];
  this.unreadTraker = [];
  notificationList.forEach(item =>{
    if(item.comment_read_flag){
      if(!this.redTraker.includes(item.ddm_rmp_post_report)){
        this.redTraker.push(item.ddm_rmp_post_report);
        this.redNotificationList.push({reportNo:item.ddm_rmp_post_report,count:1,comment_read_flag:true})
      } else{
        this.redNotificationList[this.redTraker.indexOf(item.ddm_rmp_post_report)].count++
      }
    }
    else{
      if(!this.unreadTraker.includes(item.ddm_rmp_post_report)){
        this.unreadTraker.push(item.ddm_rmp_post_report);
        this.unreadNotificationList.push({reportNo:item.ddm_rmp_post_report,count:1,comment_read_flag:false})
      }else{
        this.unreadNotificationList[this.unreadTraker.indexOf(item.ddm_rmp_post_report)].count++
      }
    }
  })
  this.notification_number = this.unreadNotificationList.length
  this.unreadNotificationList = this.unreadNotificationList.concat(this.redNotificationList)
  }
// updating consolidated data sets 
  
}

