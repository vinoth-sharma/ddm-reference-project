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
  constructor(private generated_id_service: GeneratedReportService, 
    private router: Router,
    private authenticationService: AuthenticationService) { }

  public user_role : string;
  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.authenticationService.myMethod$.subscribe(role =>{
      if (role) {
        this.user_role = role["role"]
      }
    })
    this.router.navigate(['user', 'main', 'home']);
  }
  role() {
    this.isButton = false;
    this.authenticationService.button(this.isButton);

    console.log('success')
    this.router.navigate(['semantic'])

  }



}
