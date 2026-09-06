import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MetaService } from './services/meta.service';
import { MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'game-leela';
  items: any[] = [];
  showBreadcrumbs: boolean = false;
  mainPage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private readonly meta: MetaService,
  ) {}

  modifyBreadcrumbsItems(breadcrumbs: any[]) {
    this.items = [
      {
        caption: 'Главная',
        routerLink: '/',
      },
      ...breadcrumbs,
    ];
  }

  onActivate() {
    const firstChild = this.route.snapshot.children[0].firstChild;
    const isMainPage = firstChild?.data['isMainPage'];
    this.mainPage = isMainPage && Boolean(isMainPage);

    if (firstChild) {
      this.setBreadcrumbs(firstChild);
      this.setMetaTags(firstChild);
    }
  }

  setMetaTags = (firstChild: ActivatedRouteSnapshot) => {
    const meta: MetaDefinition[] = firstChild.data['meta'];

    if (meta) {
      this.meta.updateMetaTags(meta);
    } else {
      this.meta.removeMetaTags();
    }
  };

  setBreadcrumbs = (firstChild: ActivatedRouteSnapshot) => {
    if (firstChild?.data && firstChild?.data['breadcrumbs']) {
      this.showBreadcrumbs = true;
      this.modifyBreadcrumbsItems(firstChild.data['breadcrumbs']);
    } else {
      this.showBreadcrumbs = false;
    }
  };
}
