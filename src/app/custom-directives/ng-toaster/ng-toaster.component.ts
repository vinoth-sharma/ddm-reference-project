import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: 'app-ng-toaster',
  templateUrl: './ng-toaster.component.html',
  styleUrls: ['./ng-toaster.component.css']
})
@Injectable({ providedIn: 'root' })
export class NgToasterComponent implements OnInit {

  constructor(public toaster: MatSnackBar) { }

  ngOnInit(): void {
  }

  success(message){
    this.toaster.open(message,'',{
      duration : 2000,
      verticalPosition : 'top',
      horizontalPosition : 'right',
      panelClass : ['success-bar']
    })
  }

  error(message){
    this.toaster.open(message,"",{
      duration : 2000,
      verticalPosition : 'top',
      horizontalPosition : 'right',
      panelClass : ['error-bar']
    })
  }

  warning(message){
    this.toaster.open(message,"",{
      duration : 2000,
      verticalPosition : 'top',
      horizontalPosition : 'right',
      panelClass : ['warning-bar']
    })
  }

  customizedMsg(message){
    this.toaster.openFromComponent(CustomSnackComponent,{
      data : message,
      duration : 2000,
      verticalPosition : 'top',
      horizontalPosition : 'right',
      panelClass : ['custom-bar']
    })
  }
}



@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: './ng-toaster.component.html',
  styleUrls: ['./ng-toaster.component.css']
})
export class CustomSnackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}