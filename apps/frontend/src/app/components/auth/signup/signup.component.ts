import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  LoginUserInterface,
  SignupUserInterface,
  UserRole,
} from '../../../interface';
import { of, Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {
  TUI_PASSWORD_TEXTS,
  TUI_VALIDATION_ERRORS,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { TuiAlertService } from '@taiga-ui/core';
import { NotificationTypes } from '../../../constants';
import { passwordValidator } from '../../../helpers/string.helper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
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
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        pattern: 'Только английские буквы и цифры',
        required: 'Поле обязательно к заполнению',
        minlength: (val: any) => `Минимальная длинна: ${val.requiredLength}`,
        maxlength: (val: any) => `Максимальная длинна: ${val.requiredLength}`,
      },
    },
  ],
})
export class SignupComponent implements OnDestroy {
  showLoader: boolean = false;
  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      Validators.pattern('[A-z0-9]*'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(128),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(128),
      passwordValidator,
    ]),
    isCurator: new FormControl(false, []),
  });
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    @Inject(TuiAlertService) private readonly alert: TuiAlertService,
    @Inject(AuthenticationService)
    private authenticationService: AuthenticationService,
  ) {}

  onSubmit = (): any => {
    if (this.signupForm.valid) {
      this.showLoader = true;

      const userRole = this.signupForm.controls.isCurator.value
        ? UserRole.Curator
        : UserRole.User;

      const userData: SignupUserInterface = {
        username: this.signupForm.controls.username.value!,
        password: this.signupForm.controls.password.value!,
        role: userRole,
      };

      this.subscription.push(
        this.authenticationService.signup(userData).subscribe({
          next: () => {
            this.subscription.push(
              this.authenticationService.login(userData, '/profile'),
            );
          },
          error: (err) => {
            this.showLoader = false;
            this.alert
              .open(err.message, {
                appearance: NotificationTypes.Error,
                closeable: false,
              })
              .subscribe();
          },
        }),
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  };

  ngOnDestroy(): void {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }
}
