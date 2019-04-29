import { Component, OnInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(private generated_id_service: GeneratedReportService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })


  }
  role() {

    console.log('success')
    this.router.navigate(['module'])

  }



}
