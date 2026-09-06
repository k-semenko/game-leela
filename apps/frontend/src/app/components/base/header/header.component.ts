import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MediaHelper } from '../../../helpers/media.helper';
import { MenuGroupInterface, UserInterface } from '../../../interface';
import { AuthenticationService } from '../../../services/authentication.service';
import { mainMenu } from '../../../constants';
import { TuiDropdownComponent } from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  providers: [MediaHelper],
})
export class HeaderComponent implements OnInit {
  @ViewChild(TuiDropdownComponent)
  component?: TuiDropdownComponent;

  @Output() setBreadcrumbs = new EventEmitter<any>();

  activeTabIndex: number = 0;
  user: UserInterface | null = null;
  groups: MenuGroupInterface[] = mainMenu;
  dropdownMenuOpen: boolean = false;

  constructor(
    private router: Router,
    @Inject(MediaHelper) protected mediaHelper: MediaHelper,
    private readonly authenticationService: AuthenticationService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkNavigation();
      }
    });
  }

  ngOnInit() {}

  checkNavigation = () => {
    if (!this.user && this.authenticationService.isLoginIn) {
      this.user = this.authenticationService.currentUser;
    } else {
      this.user = this.authenticationService.currentUser ?? null;
    }

    const routerUrl = decodeURI(this.router.url);

    const regex = /\/game\/(create|connect|[0-9]+)/g;
    if (routerUrl.includes('/auth') || regex.test(routerUrl)) {
      this.activeTabIndex = -1;
    } else if (routerUrl.includes('/profile')) {
      this.activeTabIndex = this.groups[0].items.length;
    } else {
      this.groups[0].items.forEach((item, index) => {
        if (routerUrl.includes(item.routerLink)) {
          this.activeTabIndex = index;
        }
      });
    }
  };

  onClickDropdownMenu = () => {
    this.dropdownMenuOpen = false;
    // this.component?.nativeFocusableElement?.focus();
  };
}
