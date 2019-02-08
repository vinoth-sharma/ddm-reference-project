import { Component, OnInit } from '@angular/core';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import Utils from "../../utils";
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-semantic-sl',
  templateUrl: './semantic-sl.component.html',
  styleUrls: ['./semantic-sl.component.css']
})
export class SemanticSLComponent implements OnInit {

  public semanticLayers;
  public userId;

  constructor(private semanticNewService: SemanticNewService, private AuthenticationService: AuthenticationService) {
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers })
    this.AuthenticationService.Method$.subscribe(userId => this.userId = userId);
  }

  ngOnInit() {
    this.getSemanticLayers();
  }

  // Call for SL list by running authentication service call
  public getSemanticLayers() {
    Utils.showSpinner();
    this.AuthenticationService.getSldetails(this.userId).subscribe((res) => {
      Utils.hideSpinner();
      this.semanticLayers = res['data']['sl_list'];
      this.semanticNewService.dataMethod(this.semanticLayers);
      console.log('yaaay', this.semanticLayers)
    }, (err) => {
      console.log(err['message'])
    })
  };

  newSM() {
    document.getElementById('new').style.backgroundColor = "rgb(87, 178, 252)";
    document.getElementById('existing').style.backgroundColor = "rgb(33, 150, 243)";
  }
  existingSM() {
    document.getElementById('existing').style.backgroundColor = "rgb(87, 178, 252)";
    document.getElementById('new').style.backgroundColor = "rgb(33, 150, 243)";

  }
}
