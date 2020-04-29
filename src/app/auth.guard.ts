import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthSsoService } from './auth-sso.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSsoService: AuthSsoService) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authSsoService.getTokenId()) {
      return true;
    }
    else {
      return false;
    }
  }
}
