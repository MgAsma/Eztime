import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
authToken:any;
  constructor() {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const skipUrl = [
    'https://eztime.thestorywallcafe.com/api/login',
    'https://eztime.thestorywallcafe.com/api/register',
    'https://eztime.thestorywallcafe.com/api/forgot-password-send-otp',
    'https://eztime.thestorywallcafe.com/api/otp-verify-forgot-pass',
    'https://eztime.thestorywallcafe.com/api/password-reset',
    ];
    if (skipUrl.indexOf(request.url) === -1) {
      this.authToken=sessionStorage.getItem('token');
       request = request.clone({
            setHeaders: {
                'Authorization': `${this.authToken}`,
                'Content-Type': 'application/json'
            }
        });
    }
    return next.handle(request);
}
}
