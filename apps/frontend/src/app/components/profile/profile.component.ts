import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {
  GameInterface,
  ProfileGamesInterface,
  UserProfileInterface,
} from '../../interface';
import { HttpService } from '../../services/http.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { sortGamesByCreateDesc } from '../../helpers/json.helper';
import { MetaService } from '../../services/meta.service';
import { NotificationTypes, profileActionsButtons } from '../../constants';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { Router } from '@angular/router';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { formattedDate } from '../../helpers/date.helper';
import { PaymentStatus } from './payments.interface';

interface ActionsButton {
  description: string;
  header: string;
  icon: string;
  routerLink: string;
  type?: string;
  hideText: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  activeItemIndex = NaN;
  subscriptions: Subscription[] = [];
  user: UserProfileInterface | null = null;
  chartClass: BehaviorSubject<string> = new BehaviorSubject<string>('');
  actionsButtons: ActionsButton[] = profileActionsButtons;
  gamesData: ProfileGamesInterface = {
    my: { index: 0, games: [] },
    withMe: { index: 0, games: [] },
  };

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(AuthenticationService)
    protected readonly authenticationService: AuthenticationService,
    @Inject(HttpService) private readonly httpService: HttpService,
    private readonly meta: MetaService,
    private readonly alert: TuiAlertService,
    private readonly router: Router,
  ) {
    this.subscriptions.push(
      this.httpService.profile().subscribe({
        next: (user: UserProfileInterface) => {
          this.user = user;

          if (!user.freeGames || user.freeGames < 3) {
            this.chartClass.next('error');
          } else if (user.freeGames && user.freeGames < 5) {
            this.chartClass.next('warning');
          } else {
            this.chartClass.next('');
          }

          this.getUserGames(user.id);
        },
        error: (err) => {
          this.alert
            .open(`Не удалось обновить данные пользователя\n${err.message}`, {
              appearance: NotificationTypes.Error,
            })
            .subscribe();
        },
      }),
    );
  }

  getUserGames = (userId: number) => {
    this.subscriptions.push(
      this.httpService
        .getUserGames(userId)
        .subscribe((data: GameInterface[]) => {
          const myGames = data.filter((g) => g.user?.id === this.user?.id);
          const gamesWithMe = data.filter(
            (g) => !!g.players.find((p) => p.userId === this.user?.id),
          );

          this.gamesData = {
            my: {
              index: 0,
              games: myGames.sort(sortGamesByCreateDesc),
            },
            withMe: {
              index: 0,
              games: gamesWithMe.sort(sortGamesByCreateDesc),
            },
          };
        }),
    );
  };

  createGame = () => {
    if (this.user?.freeGames === 0) {
      this.alert
        .open(
          'Исчерпано количество бесплатных игр. Необходимо приобрести дополнительные игры',
          { appearance: NotificationTypes.Error, autoClose: 5000 },
        )
        .subscribe();
    } else {
      this.router.navigateByUrl('/game/create');
    }
  };

  ngOnInit(): void {
    // this.meta.removeMetaTags();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  showPaymentsDialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogs.open(
      content,
      {
        label: `Платежи (${this.user?.payments?.length})`,
        size: 'm',
      }).subscribe();
  }

  protected readonly formattedDate = formattedDate;

  getPayStatus(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.SUCCEEDED:
        return 'Платеж успешно завершен';
      case PaymentStatus.PENDING:
        return 'Ожидается оплата';
      case PaymentStatus.CANCELED:
        return 'Платеж отменен';
      default:
        return 'Ошибка платежа';
    }
  }
}
