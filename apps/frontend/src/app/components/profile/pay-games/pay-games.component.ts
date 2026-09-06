import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TariffInterface } from '../../base/prices/tariff.interface';
import { HttpClient } from '@angular/common/http';
import {
  NotificationTypes,
  tariffsIcons,
  tariffsTypes,
} from 'src/app/constants';
import { UserProfileInterface } from '../../../interface';
import { HttpService } from '../../../services/http.service';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-pay-games',
  templateUrl: './pay-games.component.html',
  styleUrls: ['./pay-games.component.sass'],
})
export class PayGamesComponent {
  protected readonly tariffsIcons = tariffsIcons;
  protected readonly tariffsTypes = tariffsTypes;
  user: UserProfileInterface | null = null;
  payGamesForm: FormGroup = new FormGroup({
    tariffId: new FormControl(null, [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });
  tariffs: TariffInterface[] = [];
  showLoader: boolean = true;

  constructor(
    private readonly http: HttpClient,
    private readonly httpService: HttpService,
    private readonly alert: TuiAlertService,
  ) {
    this.httpService.profile().subscribe({
      next: (user: UserProfileInterface) => {
        this.user = user;
        this.payGamesForm.patchValue({ email: user.email ?? '' });
      },
      error: (err) => {
        console.log('Не удалось обновить данные пользователя', err);
      },
    });

    this.http.get<TariffInterface[]>('api/tariffs').subscribe({
      next: (tariffs) => {
        this.tariffs = tariffs;
        this.payGamesForm.patchValue({ tariffId: tariffs[0].id });
        this.showLoader = false;
      },
      error: (err) => {
        console.log('Не удалось получить тарифы', err);
      },
    });
  }

  onSubmit() {
    if (this.payGamesForm.valid) {
      this.showLoader = true;

      this.httpService
        .getPaymentLink(this.payGamesForm.value)
        .then((link) => (location.href = link))
        .catch((err) => {
          this.showLoader = false;
          this.alert
            .open(err.message, { appearance: NotificationTypes.Error })
            .subscribe();
        });
    } else {
      this.payGamesForm.markAllAsTouched();
    }
  }

  identityMatcher = (a: number, b: number) => a === b;
}
