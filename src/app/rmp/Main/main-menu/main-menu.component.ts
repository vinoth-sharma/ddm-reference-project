import { Component, OnInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { SharedDataService } from '../../../create-report/shared-data.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  public isButton: boolean;
  constructor(private generated_id_service: GeneratedReportService, 
    private router: Router,
    private authenticationService: AuthenticationService,
    private sharedDataService:SharedDataService) { 
      this.authenticationService.myMethod$.subscribe(role =>{
        if (role) {
          this.user_role = role["role"];
        } else {
          return;
        }
      })
    }

  public user_role : string;
  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.router.navigate(['user', 'main', 'home']);
  }
  role() {
    this.isButton = false;
    this.authenticationService.button(this.isButton);
    this.sharedDataService.setRequestId(0);
    this.router.navigate(['semantic'])

  }



}
