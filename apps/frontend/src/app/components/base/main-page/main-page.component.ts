import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass'],
})
export class MainPageComponent implements OnInit {
  constructor(
    @Inject(AuthenticationService)
    protected readonly authenticationService: AuthenticationService,
    protected readonly meta: MetaService,
  ) {}

  ngOnInit() {
    this.meta.updateMetaTags([
      {
        name: 'title',
        content: 'Трансформационная игра "ЛИЛА"',
      },
      {
        name: 'description',
        content:
          'ЛИЛА – настольная игра самопознания, онлайн! Возникла в Индии более 2000 лет назад. В современном варианте ЛИЛА выглядит как обычная настольная «игра – бродилка» , где каждая клетка игрового поля соответствует внутренним состояниям игрока и реальным ситуациям в жизни.',
      },
      {
        name: 'keywords',
        content:
          'трансформационная игра, игра лила, лила онлайн, трансформационная игра лила онлайн, настольная игра самопознания',
      },
    ]);
  }

  scrollBtn = () => {
    const scroll =
      document.querySelector<HTMLElement>('.presentation')?.offsetTop;

    if (scroll) {
      scrollTo({ top: scroll - 76, behavior: 'smooth' });
    }
  };
}
