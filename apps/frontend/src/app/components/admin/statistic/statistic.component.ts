import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { GameInterface, UserProfileInterface } from '../../../interface';
import { Subscription } from 'rxjs';
import { FeedbackInterface } from '../../base/help/help.interface';
import { Pages } from '../admin.component';

@Component({
  selector: 'admin-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.sass'],
})
export class StatisticComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  protected readonly Pages = Pages;

  @Input() games: GameInterface[] = [];
  @Input() gamesCountValues: number[] = [1, 1];

  @Input() users: UserProfileInterface[] = [];
  @Input() usersCount: number[] = [1, 1, 1];

  @Input() feedback: FeedbackInterface[] = [];
  @Input() feedbackCount: number[] = [1, 1];

  @Output() activePage = new EventEmitter<Pages>();

  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async ngOnInit() {}

  openPage = (page: Pages) => {
    this.activePage.emit(page);
  };

  ngOnDestroy() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
