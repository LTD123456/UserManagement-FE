import { Router } from '@angular/router';
import { AuthService } from './../services/auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifyReq = req.clone({ withCredentials: true });
        return next.handle(modifyReq).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                return this.authService.refreshToken().pipe(
                  switchMap(() => {
                    return next.handle(req.clone({ withCredentials: true }));
                  }),
                  catchError(err => {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                    return throwError(() => err);
                  })
                );
              }
              return throwError(() => error);
            })
          );
    }

}