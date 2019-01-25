import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-ddm-landing-page",
  templateUrl: "./ddm-landing-page.component.html",
  styleUrls: ["./ddm-landing-page.component.css"]
})

export class DdmLandingPageComponent implements OnInit {

  arr;
  columns;
  public views;
  public semanticNames;
  sls;
  sel;
  det; roles; roleName;
  public isButton: boolean = false;
  public sele;
  public show: boolean = false;
  public buttonName: any = '▼';
  public errorMsg;
  public userid;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: AuthenticationService, private toasterService: ToastrService, private se: SemdetailsService, private obj: ObjectExplorerSidebarService) {
    this.user.myMethod$.subscribe((arr) =>
      this.arr = arr);
    this.roles = this.arr.user;
    this.roleName = this.arr.role_check;
  }

  fun(event: any) {
    this.isButton = true;
    this.sel = event.target.value;
    this.sls = this.semanticNames.find(x => x.sl_name == this.sel).sl_id;
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        element.data["semantic"] = this.sel;
        element.data["semantic_id"] = this.sls;
      }
    });
    this.activatedRoute.snapshot.data["semantic"] = this.sel;
    this.sele = this.sel;
    this.se.fetchsem(this.sls).subscribe(res => {
      this.columns = res["data"]["sl_table"];
      if (this.columns && this.columns.length > 0) {
        this.se.myMethod(this.columns);
      }
      else {
        this.errorMsg = "No tables available"
        this.obj.footmethod(this.errorMsg);
      }
    });
    this.se.getviews(this.sls).subscribe(res => {
      this.views = res["data"]["sl_view"];
      this.obj.viewMethod(this.views);
    });
  };

  callSemanticlayer() {
    this.route.navigate(['semantic']);
  }

  ngOnInit() {
    this.user.errorMethod$.subscribe((userid) =>
    this.userid = userid);
    this.user.fun(this.userid).subscribe(res => {
    this.semanticNames = res["sls"];
    }
    )
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "▲";
    else
      this.buttonName = "▼";
  }
}
