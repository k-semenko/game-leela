import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { LoginUserInterface } from '../../interface';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {
  TUI_PASSWORD_TEXTS,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
  providers: [
    tuiInputPasswordOptionsProvider({
      icons: {
        hide: 'tuiIconUnlockLarge',
        show: 'tuiIconLockLarge',
      },
    }),
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: of(['']),
    },
  ],
})
export class AuthComponent implements OnInit, OnDestroy {
  showLoader: boolean = false;
  returnUrl: string | null = null;
  authForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  private subscription!: Subscription;

  constructor(
    @Inject(AuthenticationService)
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  ngOnInit() {}

  onSubmit(): void {
    if (this.authForm.valid) {
      this.showLoader = true;

      const user: LoginUserInterface = {
        username: this.authForm.get('username')?.value!,
        password: this.authForm.get('password')?.value!,
      };

      const url = this.returnUrl
        ? decodeURIComponent(this.returnUrl)
        : '/profile';
      this.subscription = this.authenticationService.login(user, url);

      setTimeout(() => (this.showLoader = false), 500);
    } else {
      this.authForm.markAllAsTouched();
      this.showLoader = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
