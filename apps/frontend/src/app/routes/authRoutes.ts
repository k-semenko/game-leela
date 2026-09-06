import { AuthComponent } from '../components/auth/auth.component';
import { LogoutComponent } from '../components/auth/logout/logout.component';
import { SignupComponent } from '../components/auth/signup/signup.component';
import { Route } from '@angular/router';

export const AuthRoutes: Route = {
  path: 'auth',
  children: [
    {
      path: '',
      component: AuthComponent,
      title: 'Авторизация',
    },
    {
      path: 'logout',
      component: LogoutComponent,
      title: 'Выход',
    },
    {
      path: 'signup',
      component: SignupComponent,
      title: 'Регистрация',
    },
    { path: '**', redirectTo: '/' },
  ],
};
