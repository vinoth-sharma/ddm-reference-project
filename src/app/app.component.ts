import { Component } from "@angular/core";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { Router } from '@angular/router';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  constructor(private dataProvider : DataProviderService , public router: Router) {
  }


  ngOnInit(){
    this.router.navigate([''])
  }

}
