import { Inject, Injectable } from '@angular/core';
import {
  LoginUserInterface,
  SignupUserInterface,
  UserInterface,
  UserRole,
} from '../interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TuiAlertService } from '@taiga-ui/core';
import { NotificationTypes } from '../constants';

const USER_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<UserInterface | null>;
  public user: Observable<UserInterface | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(HttpService) private httpService: HttpService,
    @Inject(TuiAlertService) private alerts: TuiAlertService,
  ) {
    let initial: UserInterface | null = null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      initial = raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem(USER_KEY);
    }
    this.userSubject = new BehaviorSubject<UserInterface | null>(initial);
    this.user = this.userSubject.asObservable();
  }

  public get currentUser(): UserInterface | null {
    return this.userSubject.value;
  }

  get isLoginIn() {
    const condition =
      !!this.currentUser &&
      !!this.currentUser.exp &&
      moment().unix() < this.currentUser.exp;

    if (!condition && this.currentUser) {
      localStorage.removeItem(USER_KEY);
      this.userSubject.next(null);
    }

    return condition;
  }

  isAdmin = (): boolean => {
    if (!this.currentUser) return false;
    return this.currentUser.role === UserRole.Admin;
  };

  isAdminOrCurator = (): boolean => {
    if (!this.currentUser) return false;
    return [UserRole.Admin, UserRole.Curator].includes(this.currentUser.role!);
  };

  login = (user: LoginUserInterface, url: string) => {
    return this.http.post('api/auth/login', user).subscribe({
      next: () => {
        // JWT is in httpOnly cookie; load profile for UI only (no token in JS).
        this.httpService.userData().subscribe({
          next: (userData: UserInterface) => {
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            this.userSubject.next(userData);
            setTimeout(() => this.router.navigateByUrl(url), 500);
          },
          error: (err) =>
            this.alerts
              .open(err.message ?? 'Не удалось загрузить профиль', {
                appearance: NotificationTypes.Error,
              })
              .subscribe(),
        });
      },
      error: (err) =>
        this.alerts
          .open(err.message, {
            appearance: NotificationTypes.Error,
          })
          .subscribe(),
    });
  };

  logout = () => {
    this.http.post('api/auth/logout', {}).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession(),
    });
  };

  private clearLocalSession = () => {
    localStorage.removeItem(USER_KEY);
    // legacy cleanup
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
  };

  signup = (user: SignupUserInterface) => {
    return this.http.post<LoginUserInterface>('api/signup', user);
  };
}
