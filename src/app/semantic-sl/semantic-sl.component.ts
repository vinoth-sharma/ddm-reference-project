import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { AuthenticationService } from '../authentication.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-semantic-sl',
  templateUrl: './semantic-sl.component.html',
  styleUrls: ['./semantic-sl.component.css']
})

export class SemanticSLComponent implements OnInit {

  public semanticLayers = [];
  public userId: string;
  public routeValue: boolean;
  public isLoading: boolean;
  public userRole;

  constructor(private router: Router,private toastrService: ToastrService,private spinner : NgxSpinnerService ,private semanticNewService: SemanticNewService, private authenticationService: AuthenticationService) {
    
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers })
    this.authenticationService.Method$.subscribe(
      userId => this.userId = userId
    );
    this.authenticationService.myMethod$.subscribe(role =>{
      if (role) {
        this.userRole = role["role"];
      }
    })
    this.ngOnInit()
  }

  ngOnInit() {
    // UNCOMMENT BEFORE COMMITTING!!!!!
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (val['urlAfterRedirects'] === '/semantic/sem-sl/sem-existing') {
          this.getSemanticLayers();
        }
        else if (val['urlAfterRedirects'] === '/semantic/sem-sl/sem-new') {
          this.getSemanticLayers();
        }
      }
    })
    // this.getSemanticLayers();
    this.authenticationService.slRoute$.subscribe((routeValue) => { this.routeValue = routeValue });
  }
  
  public getSemanticLayers() {
    this.isLoading = true;
    // this.spinner.show("mini");
    this.authenticationService.getSldetails(this.userId).subscribe((res) => {
      this.semanticLayers = res['data']['sl_list'];
      this.semanticNewService.dataMethod(this.semanticLayers);
      this.isLoading = false;
      // this.spinner.hide("mini")
    }, (err) => {
      this.toastrService.error(err['message']);
    })
  };
}
