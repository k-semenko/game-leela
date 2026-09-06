import {
  canActivateByRole,
  canAuthorized,
} from '../services/permissions.service';
import { CreateGameComponent } from '../components/game/create/create-game.component';
import { ConnectGameComponent } from '../components/game/connect-game/connect-game.component';
import { GameFieldComponent } from '../components/game/game-field/game-field.component';
import { Route } from '@angular/router';

export const GameRoutes: Route = {
  path: 'game',
  canActivate: [canAuthorized],
  children: [
    {
      path: 'create',
      component: CreateGameComponent,
      canActivate: [canActivateByRole],
      title: 'Создание игры',
      data: {
        roles: ['CURATOR', 'ADMIN'],
        breadcrumbs: [
          { caption: 'Профиль', routerLink: '/profile' },
          { caption: 'Создание игры', routerLink: '/game/create' },
        ],
      },
    },
    {
      path: 'connect',
      component: ConnectGameComponent,
      title: 'Присоединение к игре',
      data: {
        breadcrumbs: [
          { caption: 'Профиль', routerLink: '/profile' },
          { caption: 'Присоединение к игре', routerLink: '/game/connect' },
        ],
      },
    },
    {
      path: '**',
      component: GameFieldComponent,
      title: `Игра`,
    },
  ],
};
