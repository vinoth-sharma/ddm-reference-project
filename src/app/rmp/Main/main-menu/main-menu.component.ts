import { Component, OnInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Router } from '@angular/router';
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

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.router.navigate(['user', 'main', 'home']);
  }
  role() {
    this.isButton = false;
    this.authenticationService.button(this.isButton);
    this.router.navigate(['semantic'])
  }

  selectedTab(tab: any) {
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
