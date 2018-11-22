import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';   

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private user:AuthenticationService, private router:Router) {}  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.user.getUserDetails()) {
        console.log("You are authenticated") 
        return true;
      }
     else {
        this.router.navigate(['']);
        console.log("You are not authenticated")
        return false;
       
     }
       
      // }
     
  }
}
