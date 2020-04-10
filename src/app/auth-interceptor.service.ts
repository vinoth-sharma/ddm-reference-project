import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthSsoService } from './auth-sso.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authSsoService:AuthSsoService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(this.authSsoService.getTokenId()){
            req = req.clone({
                setHeaders: {
                    'Authorization': this.authSsoService.getTokenId()
                },
            });
        }else{
            req = req.clone({
                setHeaders: {
                    'Authorization': ''
                },
            });
        }

        return next.handle(req).pipe(tap(event => {
            
                    }, error => {
                        if(error.status == '403'){
                            window.location.href = error.error.redirect_url;
                            // location.reload();
                        }
                        
                    })
                )
                
    }
}