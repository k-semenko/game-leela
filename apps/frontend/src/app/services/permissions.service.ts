import { inject, Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    @Inject(AuthenticationService)
    private authenticationService: AuthenticationService,
    @Inject(HttpClient) private readonly http: HttpClient,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const roles: UserRole[] = route.data['roles'];
    return this.http.post('api/role-access', { roles: [...roles] }).pipe(
      map((success: any) => true),
      catchError((e) => this.handleError(e)),
    );
  }

  canAuthorized(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.http
      .get('api/authenticate', {
        params: {
          returnUrl: state.url,
        },
      })
      .pipe(
        map((success: any) => true),
        catchError((e) => this.handleError(e)),
      );
  }

  private handleError(error: any) {
    return of(false);
  }
}

export const canActivateByRole: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(route, state);
};

export const canAuthorized: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canAuthorized(route, state);
};
