import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
@Component({
  selector: "app-ddm-landing-page",
  templateUrl: "./ddm-landing-page.component.html",
  styleUrls: ["./ddm-landing-page.component.css"]
})
export class DdmLandingPageComponent implements OnInit {
  sem;
  arr;
  columns;
  sls;
  sel;
  det;
  isbutton: boolean = false;
  public sele;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private user: AuthenticationService,
    private se: SemdetailsService
  ) {
    this.user.myMethod$.subscribe(arr => (this.arr = arr));
    this.sem = this.arr.sls;
  }

  fun(event: any) {
    this.isbutton = true;
    this.sel = event.target.value;
    this.sls = this.sem.find(x => x.sl_name == this.sel).sl_id;
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        element.data["semantic"] = this.sel;
        element.data["semantic_id"] = this.sls;
      }
    });
    this.activatedRoute.snapshot.data["semantic"] = this.sel;
    this.sele = this.sel;
    this.se.fetchsem(this.sls).subscribe(res => {
      this.det = res as object[];
      this.columns = res["data"]["sl_table"];
      this.se.myMethod(this.sele);
      this.se.myMethod(this.columns);
    });
  };

  callSemanticlayer() {
    this.route.navigate(["semantic"]);
  };

  ngOnInit() {}
}
