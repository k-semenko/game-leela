import { Route } from '@angular/router';
import { AgreementComponent } from '../components/base/agreement/agreement.component';
import { PricesComponent } from '../components/base/prices/prices.component';
import { MainPageComponent } from '../components/base/main-page/main-page.component';
import { PolicyComponent } from '../components/base/policy/policy.component';
import { HelpComponent } from '../components/base/help/help.component';
import { GameRulesComponent } from '../components/base/game-rules/game-rules.component';
import { ContactsComponent } from '../components/base/contacts/contacts.component';
import { PaymentRulesComponent } from '../components/base/prices/payment-rules/payment-rules.component';
import { ChangePasswordComponent } from '../components/base/change-password/change-password.component';

export const MainRoutes: Route = {
  path: '',
  children: [
    {
      path: '',
      title: 'Game Leela | Трансформационная игра «ЛИЛА»',
      component: MainPageComponent,
      data: {
        isMainPage: true,
      },
    },
    {
      path: 'policy',
      component: PolicyComponent,
      title: 'Политика конфиденциальности',
      data: {
        breadcrumbs: [
          { caption: 'Политика конфиденциальности', routerLink: 'policy' },
        ],
      },
    },
    {
      path: 'agreement',
      component: AgreementComponent,
      title: 'Пользовательское соглашение',
      data: {
        breadcrumbs: [
          { caption: 'Пользовательское соглашение', routerLink: 'agreement' },
        ],
      },
    },
    {
      path: 'prices',
      component: PricesComponent,
      title: 'Цены и тарифы',
      data: {
        breadcrumbs: [{ caption: 'Цены и тарифы', routerLink: 'prices' }],
      },
    },
    {
      path: 'payment-rules',
      component: PaymentRulesComponent,
      title: 'Правила оплаты и возврата',
      data: {
        breadcrumbs: [
          { caption: 'Правила оплаты и возврата', routerLink: 'payment-rules' },
        ],
      },
    },
    {
      path: 'help',
      component: HelpComponent,
      title: 'Помощь',
      data: {
        breadcrumbs: [{ caption: 'Помощь', routerLink: 'help' }],
      },
    },
    {
      path: 'contacts',
      component: ContactsComponent,
      title: 'Контакты',
      data: {
        breadcrumbs: [{ caption: 'Контакты', routerLink: 'contacts' }],
      },
    },
    {
      path: 'rules',
      component: GameRulesComponent,
      title: 'Правила и ход игры',
      data: {
        breadcrumbs: [{ caption: 'Правила и ход игры', routerLink: 'rules' }],
      },
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent,
      title: 'Восстановить пароль',
    },
  ],
};
