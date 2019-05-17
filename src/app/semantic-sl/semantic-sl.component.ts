import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { AuthenticationService } from '../authentication.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-semantic-sl',
  templateUrl: './semantic-sl.component.html',
  styleUrls: ['./semantic-sl.component.css']
})

export class SemanticSLComponent implements OnInit {

  public semanticLayers = [];
  public userId: string;
  public isLoading: boolean;

  constructor(private toastrService: ToastrService,private spinner : NgxSpinnerService ,private semanticNewService: SemanticNewService, private authenticationService: AuthenticationService) {
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers })
    this.authenticationService.Method$.subscribe(
      userId => this.userId = userId
    );
    this.ngOnInit()
  }

  ngOnInit() {
    this.getSemanticLayers();
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
