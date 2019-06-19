import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';   
import { AuthSsoService } from './auth-sso.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private user:AuthenticationService, private router:Router, private authSsoService:AuthSsoService) {}  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // this.user.getUserDetails()
      if (this.authSsoService.getTokenId()) {
        //console.log("User session is being logged") 
        return true;
      }
     else {
        // this.router.navigate(['']);
        // //console.log("Authentication failure")
        return false;
     }
  }
}
