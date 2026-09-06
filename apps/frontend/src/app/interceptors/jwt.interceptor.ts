import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Auth is httpOnly cookie (same-origin via nginx). Do not attach JWT from JS storage.
    return next.handle(request).pipe(
      catchError((error: any) => {
        this.errorTypeMapper(request, error);

        return throwError(() => {
          if (error.error !== null) {
            return error.error;
          }

          return error;
        });
      }),
    );
  }

  errorTypeMapper = (request: HttpRequest<any>, error: any) => {
    if (error.status == 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      if (request.params.has('returnUrl')) {
        this.router.navigate(['/auth'], {
          queryParams: {
            returnUrl: encodeURIComponent(request.params.get('returnUrl')!),
          },
        });
      } else {
        this.router.navigate(['/auth']);
      }
    }

    if ((error.status == 403 || error.status == 404) && !request.url.includes('api')) {
      this.router.navigateByUrl(`/error/${error.status}`);
    }

    if (error.status === 502) {
      error.error = {
        statusCode: 504,
        message: 'Непредвиденная ошибка',
      };
    }
  };
}
