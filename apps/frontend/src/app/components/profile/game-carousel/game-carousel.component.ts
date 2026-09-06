import { Component, Input, OnInit } from '@angular/core';
import { formattedDate } from '../../../helpers/date.helper';
import { GameInterface } from '../../../interface';

@Component({
  selector: 'games-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.sass'],
})
export class GameCarouselComponent implements OnInit {
  protected readonly formattedDate = formattedDate;
  @Input() games: GameInterface[] = [];
  @Input() title: string = '';
  @Input() notifyText: string = '';
  @Input() link?: { text: string; href: string } = undefined;

  itemsCount: number = 3;
  index: number = 0;

  ngOnInit() {
    this.onResize();
  }

  onResize = (event?: any) => {
    const width = window.innerWidth;
    if (width >= 1399) {
      this.itemsCount = 3;
    } else if (width > 768 && width < 1399) {
      this.itemsCount = 2;
    } else {
      this.itemsCount = 1;
    }
  };

  rounded = (): number => {
    return Math.ceil(this.index / this.itemsCount);
  };

  pages = (): number => {
    return Math.ceil(this.games.length / this.itemsCount);
  };

  onIndex(index: number): void {
    this.index = index * this.itemsCount;
  }

  getFieldHref = (url: string) => {
    return url.replace(/url\("(.*)"\)/, '$1')
  }
}
