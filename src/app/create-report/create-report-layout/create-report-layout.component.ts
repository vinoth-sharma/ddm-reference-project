import { Component,  OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  show: boolean;

  constructor(private router: Router) { 
    // router.events.subscribe((val) => {
    //   console.log('in router'+val)
    //   console.log(NavigationEnd);
    //   if(val instanceof NavigationEnd){
    //     console.log(val,'in for');
    //     if(val.url == '/semantic/sem-reports/create-report/preview'){
    //       this.show = false;
    //     }else{
    //       this.show = true;
    //     }
    //   }
    //   // this.show = in routerNavigationEnd(id: 8, url: '/semantic/sem-reports/create-report/preview', urlAfterRedirects: '/semantic/sem-reports/create-report/preview')
    //   // if(val['NavigationEnd'].url == '/semantic/sem-reports/create-report/preview'){
    //   //   console.log('this is preview');
    //   // }
    // })
  }

  ngOnInit() {
  }

  public navigateToPreview(){
    this.router.navigate(['semantic/sem-reports/preview']);
  }

}