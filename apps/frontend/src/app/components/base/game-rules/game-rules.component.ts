import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-game-rules',
  templateUrl: './game-rules.component.html',
  styleUrls: ['./game-rules.component.sass'],
})
export class GameRulesComponent implements OnInit {
  constructor(private readonly meta: MetaService) {}

  ngOnInit() {
    this.meta.updateMetaTags([
      {
        name: 'title',
        content: 'Правила и ход игры',
      },
      {
        name: 'description',
        content:
          'Правила для игры ЛИЛА. Игра самопознания возникла в Индии более 2000 лет назад. В современном варианте ЛИЛА выглядит как обычная настольная «игра – бродилка» , где каждая клетка игрового поля соответствует внутренним состояниям игрока и реальным ситуациям в жизни.',
      },
    ]);
  }
}
