import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TariffInterface } from './tariff.interface';
import { tariffsIcons, tariffsTypes } from '../../../constants';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.sass'],
})
export class PricesComponent {
  protected readonly tariffsIcons = tariffsIcons;
  protected readonly tariffsTypes = tariffsTypes;

  tariffs: TariffInterface[] = [];
  constructor(private http: HttpClient) {
    this.http.get<TariffInterface[]>('api/tariffs').subscribe({
      next: (tariffs) => {
        this.tariffs = tariffs;
      },
    });
  }
}
