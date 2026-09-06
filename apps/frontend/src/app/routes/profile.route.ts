import { Route } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import {
  canActivateByRole,
  canAuthorized,
} from '../services/permissions.service';
import { SettingsComponent } from '../components/profile/settings/settings.component';
import { PayGamesComponent } from '../components/profile/pay-games/pay-games.component';

export const ProfileRoutes: Route = {
  path: 'profile',
  children: [
    {
      path: '',
      component: ProfileComponent,
      canActivate: [canAuthorized],
      title: 'Профиль',
      data: {
        breadcrumbs: [{ caption: 'Профиль', routerLink: 'profile' }],
      },
    },
    {
      path: 'settings',
      component: SettingsComponent,
      canActivate: [canAuthorized],
      title: 'Настройки профиля',
      data: {
        breadcrumbs: [
          { caption: 'Профиль', routerLink: '/profile' },
          { caption: 'Настройки', routerLink: '/profile/settings' },
        ],
      },
    },
    {
      path: 'pay-games',
      component: PayGamesComponent,
      canActivate: [canAuthorized, canActivateByRole],
      title: 'Выбор тарифа',
      data: {
        roles: ['ADMIN', 'CURATOR'],
        breadcrumbs: [
          { caption: 'Профиль', routerLink: '/profile' },
          { caption: 'Выбор тарифа', routerLink: '/profile/pay-games' },
        ],
      },
    },
  ],
};
