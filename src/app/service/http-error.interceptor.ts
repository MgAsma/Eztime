import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import isOnline from 'is-online';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        isOnline().then(online => {
          if (!online) {
            this.router.navigate(['/no-internet']);
          } else if (error.status === 404) {
            this.router.navigate(['/404']);
          } else if (error.status === 500) {
            this.router.navigate(['/500']);
          } else if (error.status === 504) {
            this.router.navigate(['/504']);
          }
        });
       
        return throwError(() => error);
      })
    );
  }
}
