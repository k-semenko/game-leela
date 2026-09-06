import { Component, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { GameInterface, UserProfileInterface, UserRole } from '../../interface';
import { Subscription } from 'rxjs';
import { FeedbackInterface } from '../base/help/help.interface';
import { environment } from '../../../environments/environment';
import { MediaHelper } from 'src/app/helpers/media.helper';

export enum Pages {
  STATISTIC = 0,
  CELLS = 1,
  ALL_GAMES = 2,
  USERS = 3,
  FEEDBACK = 4,
}

export const PagesNames = [
  'Статистика',
  'Ячейки',
  'Все игры',
  'Пользователи',
  'Обратная связь',
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
  providers: [MediaHelper],
})
export class AdminComponent {
  protected readonly Pages = Pages;
  protected readonly PagesNames = PagesNames;
  protected readonly environment = environment;

  subscriptions: Subscription[] = [];

  activePage: number = 0;

  games: GameInterface[] = [];
  gamesCountValues = [1, 1];

  users: UserProfileInterface[] = [];
  usersCount: number[] = [1, 1, 1];

  feedback: FeedbackInterface[] = [];
  feedbackCount: number[] = [1, 1];

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(MediaHelper) protected readonly mediaHelper: MediaHelper,
  ) {
    // console.log(this.Pages);

    this.subscriptions.push(
      this.httpService.getAllGames().subscribe((data: GameInterface[]) => {
        this.games = data;
        this.gamesCountValues = [
          this.games.filter((g) => g.gameEnd).length,
          this.games.filter((g) => !g.gameEnd).length,
        ];
      }),
    );

    this.subscriptions.push(
      this.httpService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.usersCount = [
            data.filter((u) => u.role === UserRole.Admin).length,
            data.filter((u) => u.role === UserRole.Curator).length,
            data.filter((u) => u.role === UserRole.User).length,
          ];
        },
      }),
    );

    this.subscriptions.push(
      this.httpService.getAllFeedback().subscribe({
        next: (data: FeedbackInterface[]) => {
          this.feedback = data;
          this.feedbackCount = [
            this.feedback.filter((f) => f.active).length,
            this.feedback.filter((f) => !f.active).length,
          ];
        },
      }),
    );
  }

  activate = (page: number) => {
    this.activePage = page;
  };
  protected readonly Object = Object;
}
