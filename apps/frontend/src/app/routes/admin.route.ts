import {
  canActivateByRole,
  canAuthorized,
} from '../services/permissions.service';
import { AdminComponent } from '../components/admin/admin.component';
import { CellsComponent } from '../components/admin/cells/cells.component';
import { AllGamesComponent } from '../components/admin/all-games/all-games.component';
import { ApiComponent } from '../components/admin/api/api.component';
import { Route } from '@angular/router';
import { AdminUsersComponent } from '../components/admin/users/admin-users.component';

export const AdminRoutes: Route = {
  path: 'admin',
  canActivate: [canAuthorized, canActivateByRole],
  data: { roles: ['ADMIN'] },
  children: [
    {
      path: '',
      title: 'Админ меню',
      component: AdminComponent,
    },
    {
      path: 'cells',
      title: 'Ячейки игры',
      component: CellsComponent,
    },
    {
      path: 'all-games',
      title: 'Все игры',
      component: AllGamesComponent,
    },
    {
      path: 'users',
      title: 'Пользователи',
      component: AdminUsersComponent,
    },
    {
      path: 'api',
      title: 'OpenApi',
      component: ApiComponent,
    },
  ],
};
