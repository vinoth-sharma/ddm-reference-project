import { Component, OnInit } from '@angular/core';
import { Router, } from '@angular/router';
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

  constructor(private route: Router,
    private authenticationService: AuthenticationService,
    private dataProvider: DataProviderService) {
    this.subscribeToService()
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
            this.user_role = role["role"]
            this.notification_list = element.filter(element => {
              return element.commentor != this.user_name
            })
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
            this.notification_number = unread.length

            var setBuilder = []
            this.notification_list.map(element => {
              setBuilder.push({ reportNo: element.ddm_rmp_post_report, comment_read_flag: element.comment_read_flag })
            })
            this.notification_set = new Set(setBuilder)
          }
        })
      }
    })
  }

  selected ;
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
}