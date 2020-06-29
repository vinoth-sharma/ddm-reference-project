import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  public isButton: boolean;
  public user_role: string = '';

  constructor(private generated_id_service: GeneratedReportService,
    private router: Router,
    public authenticationService: AuthenticationService
  ) {
    this.authenticationService.myMethod$.subscribe(role => {
      if (role)
        this.user_role = role["role"];
      else
        return;
    })
  }

  public ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.router.navigate(['user', 'main', 'home']);
  }
  public role() {
    this.isButton = false;
    this.authenticationService.button(this.isButton);
    this.router.navigate(['semantic'])
  }

  // highlighting selected tab button border bottom color of button
  public selectedTab(tab: any) {
    if(document.getElementsByClassName('left-tabs') && 
        document.getElementsByClassName('left-tabs').length && 
        document.getElementsByClassName('left-tabs')[0].children) {
      let listOfTabs = document.getElementsByClassName('left-tabs')[0].children;
      for (let i = 0; i < listOfTabs.length; i++) {
        if (listOfTabs[i]['text'].trim() == tab['target']['innerText'].trim()) {
          listOfTabs[i]['style']['borderBottom'] = '2px solid #2a6496';
        } else {
          listOfTabs[i]['style']['borderBottom'] = '';
        }
      }
    }
    
  }
}