import { Route } from '@angular/router';
import { TextPageComponent } from '../components/text-page/text-page.component';

export const ErrorRoutes: Route = {
  path: 'error',
  children: [
    {
      path: '404',
      component: TextPageComponent,
      title: '404 Страница не найдена',
    },
    { path: '**', redirectTo: '/error/404' },
  ],
};
