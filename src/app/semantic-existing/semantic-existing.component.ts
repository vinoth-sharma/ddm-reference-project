import { Component, Output, EventEmitter, OnInit, Pipe } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { JoinPipe } from 'angular-pipes';

@Component({
  selector: 'app-semantic-existing',
  templateUrl: './semantic-existing.component.html',
  styleUrls: ['./semantic-existing.component.css']
})

export class SemanticExistingComponent implements OnInit {

  public userid;
  public slList;
  public slListTable;
  constructor(private user: AuthenticationService, private router: Router, private http: Http) {
    this.user.Method$.subscribe((userid) =>
      this.userid = userid);
  }

  public getSemanticlist() {
    this.user.getSldetails(this.userid).subscribe(
      (res) => {
        console.log(res);
        this.slList = res['sl_list'];
        console.log(this.slList);
        this.slListTable = this.slList['sl_name'];
        console.log(this.slListTable);
      }, (error) => { console.log("FAILURE") })
  };

  ngOnInit() {
    this.getSemanticlist();
  }
}