import { Route } from '@angular/router';
import { PaymentComponent } from '../components/payment/payment.component';

export const PaymentRoutes: Route = {
  path: 'payment',
  children: [
    {
      path: '',
      component: PaymentComponent,
      title: 'Статус оплаты',
    },
    { path: '**', redirectTo: '/error/404' },
  ],
};
