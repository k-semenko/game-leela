import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TuiScrollService } from '@taiga-ui/cdk';
import { of } from 'rxjs';

enum TEXT_PAGE_TYPES {
  NOT_FOUND = 'NOT_FOUND',
}

@Component({
  selector: 'app-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.sass'],
})
export class TextPageComponent {
  @Input()
  type: string | null = null;
  TEXT_PAGE_TYPES = TEXT_PAGE_TYPES;
  constructor(
    private readonly router: Router,
    @Inject(TuiScrollService) private readonly scrollService: TuiScrollService,
  ) {
    of(this.type).subscribe(() => {
      this.scrollService.scroll$(window, 0, 0, 500).subscribe();
    });

    const path = this.router.url.split('/');
    if (path[1] === 'error') {
      switch (path[2]) {
        case '404':
          this.type = TEXT_PAGE_TYPES.NOT_FOUND;
          break;
        default:
          this.type = TEXT_PAGE_TYPES.NOT_FOUND;
          break;
      }
    }
  }
}
