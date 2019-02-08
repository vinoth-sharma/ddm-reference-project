import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SemanticNewService } from '../semantic-new/semantic-new.service';

@Component({
  selector: 'app-semantic-existing',
  templateUrl: './semantic-existing.component.html',
  styleUrls: ['./semantic-existing.component.css']
})

export class SemanticExistingComponent implements OnInit {

  public userId;
  public semanticLayers;
  myMethod$: Observable<any>; 
  myMethodSubject: BehaviorSubject<any>;

  constructor(private user: AuthenticationService, private semanticNewService: SemanticNewService) {
    this.user.Method$.subscribe((userid) => this.userId = userid);
      this.semanticNewService.dataMethod$.subscribe((semanticLayers) => {this.semanticLayers = semanticLayers});
  }

  ngOnInit() {}

}
