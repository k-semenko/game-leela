import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameRoutes } from './routes/game.route';
import { AuthRoutes } from './routes/authRoutes';
import { AdminRoutes } from './routes/admin.route';
import { ProfileRoutes } from './routes/profile.route';
import { ErrorRoutes } from './routes/error.route';
import { MainRoutes } from './routes/main.route';
import { PaymentRoutes } from './routes/payment.route';

const routes: Routes = [
  MainRoutes,
  GameRoutes,
  AuthRoutes,
  AdminRoutes,
  ProfileRoutes,
  PaymentRoutes,
  ErrorRoutes,
  { path: 'robots.txt', redirectTo: './robots.txt' },
  { path: '**', redirectTo: '/error/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 80],
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
