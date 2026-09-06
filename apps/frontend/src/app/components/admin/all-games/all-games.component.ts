import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { GameInterface, UserInterface } from '../../../interface';
import { HttpService } from '../../../services/http.service';
import { formattedDate } from '../../../helpers/date.helper';
import { AuthenticationService } from '../../../services/authentication.service';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { TuiTablePagination, TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import { NotificationTypes } from '../../../constants';

@Component({
  selector: 'admin-all-games',
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.sass'],
})
export class AllGamesComponent implements OnInit, OnDestroy {
  @Input() data: GameInterface[] = [];
  subscriptions: Subscription[] = [];
  games: GameInterface[] = [];
  user: UserInterface | null = null;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  columns = [
    'ID',
    'Название игры',
    'Игроки',
    'Владелец',
    'Дата создания',
    'Статус',
    'Действия',
  ];
  protected readonly formattedDate = formattedDate;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
  ) {
    this.user = this.authenticationService.currentUser;
  }

  getFilteredGames = () => {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.data.filter((game, index) => index >= start && index < end);
  };

  ngOnInit() {
    this.totalItems = this.data.length;
    this.games = this.getFilteredGames();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  changePage = (paginator: TuiTablePaginationEvent) => {
    this.currentPage = paginator.page;
    this.pageSize = paginator.size;
    this.games = this.getFilteredGames();
  };

  canDeleteGame = (userId: number) => {
    return userId === this.user?.id || this.authenticationService.isAdmin();
  };

  deleteGame = (id: number) => {
    this.httpService.removeGame(id).subscribe({
      next: () => {
        this.games = this.games.filter((g) => g.id !== id);

        const element = document.querySelector(`tr[data-id='${id}']`);
        if (element) element.remove();

        this.alerts.open('Игра удалена').subscribe();
      },
      error: (err: any) => {
        this.alerts
          .open(`Не удалось удалить игру.\n${err.message}`, {
            appearance: NotificationTypes.Error,
          })
          .subscribe();
      },
    });
  };
}
