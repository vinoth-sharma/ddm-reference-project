import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  public isLoading: boolean;

  constructor(private toastrService: ToastrService, private semanticNewService: SemanticNewService, private authenticationService: AuthenticationService) {
    this.semanticNewService.dataMethod$.subscribe((semanticLayers) => { this.semanticLayers = semanticLayers })
    this.authenticationService.Method$.subscribe(userId => this.userId = userId);
    this.ngOnInit()
  }

  ngOnInit() {
    console.log('hello')
    this.getSemanticLayers();
    $("a").on('click', function(){
      $('a').removeClass("active");
      $(this).addClass("active");
    })
  }

  public getSemanticLayers() {
    this.isLoading = true;
    this.authenticationService.getSldetails(this.userId).subscribe((res) => {
      this.semanticLayers = res['data']['sl_list'];
      this.semanticNewService.dataMethod(this.semanticLayers);
      this.isLoading = false;
    }, (err) => {
      this.toastrService.error(err['message']);
    })
  };

  semanticTabClick() {
    console.log('Hey Baby')
  }
}
