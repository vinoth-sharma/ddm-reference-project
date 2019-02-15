import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Utils from "../../utils";
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-semantic-sl',
  templateUrl: './semantic-sl.component.html',
  styleUrls: ['./semantic-sl.component.css']
})
export class SemanticSLComponent implements OnInit {

  public semanticLayers = [];
  public userId: string;
  public isLoading;

  constructor(private toastr: ToastrService, private semanticNewService: SemanticNewService, private AuthenticationService: AuthenticationService) {
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers })
    this.AuthenticationService.Method$.subscribe(userId => this.userId = userId);
  }

  ngOnInit() {
    this.getSemanticLayers();
  }

  public getSemanticLayers() {
    this.isLoading = true;
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      this.isLoading = false;
      this.semanticLayers = res['data']['sl_list'];
      this.semanticNewService.dataMethod(this.semanticLayers);
    }, (err) => {
      this.toastr.error(err['message'])
    })
  };
}
