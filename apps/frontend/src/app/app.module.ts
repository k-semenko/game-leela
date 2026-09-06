import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiIslandDirective,
  TuiSelectModule,
  TuiTextareaModule,
} from '@taiga-ui/legacy';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/base/footer/footer.component';
import { GameFieldComponent } from './components/game/game-field/game-field.component';
import { HeaderComponent } from './components/base/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  TUI_VALIDATION_ERRORS,
  TuiAccordionDirective,
  TuiAccordionItem,
  TuiAccordionItemContent,
  TuiAvatar,
  TuiAvatarStack,
  TuiBadge,
  TuiBlock,
  TuiBreadcrumbs,
  TuiButtonClose,
  TuiCarouselComponent,
  TuiCheckbox,
  TuiChip,
  TuiDataListWrapperComponent,
  TuiFieldErrorPipe,
  TuiPagination,
  TuiRadioComponent,
  TuiRadioDirective,
  TuiRadioList,
  TuiStatus,
  TuiSwitch,
  TuiTab,
  TuiTabsHorizontal,
  TuiTabsVertical,
  TuiTooltip,
} from '@taiga-ui/kit';
import { AllGamesComponent } from './components/admin/all-games/all-games.component';
import { CreateGameComponent } from './components/game/create/create-game.component';
import { NgOptimizedImage } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { of } from 'rxjs';
import { ProfileComponent } from './components/profile/profile.component';
import { ConnectGameComponent } from './components/game/connect-game/connect-game.component';
import { MainPageComponent } from './components/base/main-page/main-page.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DiceComponent } from './components/game/dice/dice.component';
import { ActionButtonComponent } from './components/base/action-button/action-button.component';
import { PolicyComponent } from './components/base/policy/policy.component';
import { AdminComponent } from './components/admin/admin.component';
import { CellsComponent } from './components/admin/cells/cells.component';
import { MovesComponent } from './components/game/moves/moves.component';
import { SettingsComponent } from './components/profile/settings/settings.component';
import { GameCarouselComponent } from './components/profile/game-carousel/game-carousel.component';
import { TextPageComponent } from './components/text-page/text-page.component';
import {
  TuiBlockStatusComponent,
  TuiBlockStatusDirective,
  TuiCardLarge,
  TuiCell,
  TuiHeader,
} from '@taiga-ui/layout';
import { StatisticComponent } from './components/admin/statistic/statistic.component';
import { TuiArcChart, TuiRingChart } from '@taiga-ui/addon-charts';
import { RingChartComponent } from './components/admin/statistic/ring-chart/ring-chart.component';
import { ApiComponent } from './components/admin/api/api.component';
import { HelpComponent } from './components/base/help/help.component';
import { GameRulesComponent } from './components/base/game-rules/game-rules.component';
import { AdminUsersComponent } from './components/admin/users/admin-users.component';
import { AdminFeedbackComponent } from './components/admin/feedback/admin-feedback.component';
import { AgreementComponent } from './components/base/agreement/agreement.component';
import { PricesComponent } from './components/base/prices/prices.component';
import { ContactsComponent } from './components/base/contacts/contacts.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentRulesComponent } from './components/base/prices/payment-rules/payment-rules.component';
import { PayGamesComponent } from './components/profile/pay-games/pay-games.component';
import { ChangePasswordComponent } from './components/base/change-password/change-password.component';
import {
  TuiAppearance,
  TuiButton,
  TuiDataListComponent,
  TuiDialog,
  TuiError,
  TuiGroup,
  TuiIcon,
  TuiIconPipe,
  TuiLabel,
  TuiLink,
  TuiLoader,
  TuiNotification,
  TuiOptGroup,
  TuiOption,
  TuiRoot,
  TuiScrollbar,
  TuiSurface,
  TuiTextfieldDirective,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiItem } from '@taiga-ui/cdk';
import {
  TuiGenericFilter,
  TuiTableCell,
  TuiTableDirective,
  TuiTableFilterDirective,
  TuiTableFiltersPipe,
  TuiTablePagination,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
  TuiTableThGroup,
  TuiTableTr,
} from '@taiga-ui/addon-table';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    GameFieldComponent,
    HeaderComponent,
    AllGamesComponent,
    CreateGameComponent,
    AuthComponent,
    LogoutComponent,
    ProfileComponent,
    ConnectGameComponent,
    MainPageComponent,
    SignupComponent,
    DiceComponent,
    ActionButtonComponent,
    PolicyComponent,
    AdminComponent,
    CellsComponent,
    MovesComponent,
    SettingsComponent,
    GameCarouselComponent,
    TextPageComponent,
    StatisticComponent,
    RingChartComponent,
    RingChartComponent,
    ApiComponent,
    HelpComponent,
    GameRulesComponent,
    AdminUsersComponent,
    AdminFeedbackComponent,
    AgreementComponent,
    PricesComponent,
    ContactsComponent,
    PaymentComponent,
    PaymentRulesComponent,
    PayGamesComponent,
    ChangePasswordComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    TuiArcChart,
    TuiBlockStatusComponent,
    TuiBlockStatusDirective,
    TuiNotification,
    TuiError,
    TuiFieldErrorPipe,
    TuiButton,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiLoader,
    TuiScrollbar,
    TuiBadge,
    TuiAmountPipe,
    TuiIcon,
    TuiBlock,
    TuiRadioComponent,
    TuiTitle,
    TuiTooltip,
    TuiPagination,
    TuiCarouselComponent,
    TuiAvatar,
    TuiCheckbox,
    TuiDataListComponent,
    TuiTabsHorizontal,
    TuiTab,
    TuiOptGroup,
    TuiOption,
    TuiGroup,
    TuiTextfieldDirective,
    TuiRoot,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    TuiRadioList,
    TuiButtonClose,
    TuiTableDirective,
    TuiTabsVertical,
    TuiTablePagination,
    TuiTableTbody,
    TuiTableTr,
    TuiTableTd,
    TuiTableCell,
    TuiInputNumberModule,
    TuiTableFilterDirective,
    TuiGenericFilter,
    TuiTextareaModule,
    TuiTableFiltersPipe,
    TuiTableTh,
    TuiDialog,
    TuiSwitch,
    TuiRingChart,
    TuiDataListWrapperComponent,
    TuiSelectModule,
    TuiAppearance,
    TuiIconPipe,
    TuiCardLarge,
    TuiCell,
    TuiSurface,
    TuiHeader,
    TuiStatus,
    TuiChip,
    TuiLabel,
    TuiRadioDirective,
    TuiIslandDirective,
    TuiAccordionDirective,
    TuiAccordionItemContent,
    TuiAccordionItem,
    TuiAvatarStack,
    TuiTableThGroup,
  ],
  providers: [
    NG_EVENT_PLUGINS,
    { provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE) },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Поле обязательно к заполнению',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
