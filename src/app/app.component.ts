import { Component } from "@angular/core";
import { DataProviderService } from "src/app/rmp/data-provider.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "DDM";

  associates;
  firstName;
  userData;
  lastName;
  roleId;
  roleName;
  dataLoad = false;

  public spinnerConfig: any = {
    bdColor: "rgba(51,51,51,0.8)",
    size: "default",
    color: "#fff",
    type: "line-spin-clockwise-fade"
  };

  constructor(private dataProvider : DataProviderService) {
    this.associates = [
      {
        role: "Admin",
        firstname: "Jacquelin",
        lastname: "Beiter"
      },
      { role: "Non-Admin", firstname: "Aubrey", lastname: "Dubberke" },
      { role: "Report Viewer", firstname: "Charlie", lastname: "Chevoor" }
    ];
    this.dataProvider.currentIntialLoad.subscribe(element => {
      if (element) {
        this.dataLoad = true
      }
    })
  }

  recieveUserdetails($event) {
    this.roleId = $event;
    //console.log(this.roleId);
  }
}
