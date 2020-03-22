import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

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

}
