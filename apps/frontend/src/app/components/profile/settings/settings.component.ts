import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { NotificationTypes } from '../../../constants';
import { UserProfileInterface } from '../../../interface';
import {
  TUI_CONFIRM,
  TUI_PASSWORD_TEXTS,
  TUI_VALIDATION_ERRORS,
  TuiConfirmData,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { passwordValidator } from '../../../helpers/string.helper';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
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
        required: 'Поле обязательно к заполнению',
        minlength: (val: any) => `Минимальная длинна: ${val.requiredLength}`,
        maxlength: (val: any) => `Максимальная длинна: ${val.requiredLength}`,
      },
    },
  ],
})
export class SettingsComponent implements AfterViewInit, OnDestroy {
  subscriptions: Subscription[] = [];
  user!: UserProfileInterface;
  noTgConnect: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  updateProfileForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    firstName: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
  });

  changePassForm = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(128),
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
  });

  ngOnDestroy() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });

    // @ts-expect-error onTelegramAuth
    window['onTelegramAuth'] = undefined;
  }

  ngAfterViewInit() {
    // @ts-expect-error onTelegramAuth
    window['onTelegramAuth'] = (loginData: any) =>
      this.onTelegramAuth(loginData);
  }

  constructor(
    @Inject(Router) private router: Router,
    @Inject(HttpService) private httpService: HttpService,
    @Inject(TuiAlertService) private readonly alert: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(AuthenticationService)
    private authenticationService: AuthenticationService,
  ) {
    const updateProfile = this.httpService.profile().subscribe({
      next: (user: UserProfileInterface) => {
        this.user = user;
        this.noTgConnect.next(user.tg === null);

        if (this.noTgConnect.value) {
          setTimeout(() => this.convertToScript(), 150);
        }

        this.updateProfileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      },
      error: (err) => {
        this.alert
          .open(`Не удалось получить данные пользователя\n${err.message}`, {
            appearance: NotificationTypes.Error,
          })
          .subscribe();
      },
    });

    this.subscriptions.push(updateProfile);
  }

  convertToScript() {
    const element = document.getElementById('script');
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', environment.botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    element?.replaceWith(script);
  }

  onTelegramAuth(loginData: any) {
    this.subscriptions.push(
      this.httpService.tgLogin(loginData.id).subscribe({
        next: () => location.reload(),
        error: (err) => console.log(err),
      }),
    );
  }

  telegramDeleteRel = () => {
    this.subscriptions.push(
      this.httpService.tgRemove().subscribe({
        next: () => location.reload(),
        error: (err) => console.log(err),
      }),
    );
  };

  onSubmit = () => {
    if (this.updateProfileForm.valid) {
      const form = this.updateProfileForm.value;
      const userData: UserProfileInterface = {
        id: this.user.id,
        email: form.email === '' ? null : (form.email ?? null),
        firstName: form.firstName === '' ? null : (form.firstName ?? null),
        lastName: form.lastName === '' ? null : (form.lastName ?? null),
      };

      this.httpService.updateUserData(userData).subscribe({
        next: () => {
          this.alert
            .open('Данные успешно обновлены!', {
              appearance: NotificationTypes.Success,
            })
            .subscribe();
        },
        error: (err) => {
          this.alert
            .open(err.message, { appearance: NotificationTypes.Error })
            .subscribe();
        },
      });
    } else {
      this.updateProfileForm.markAllAsTouched();
      this.alert
        .open('Не удалось обновить данные профиля', {
          appearance: NotificationTypes.Error,
        })
        .subscribe();
    }
  };

  deleteProfile = () => {
    const data: TuiConfirmData = {
      content: 'Вы уверены, что хотите удалить профиль?',
      yes: 'Удалить',
      no: 'Я передумал',
    };
    this.subscriptions.push(
      this.dialogs
        .open<boolean>(TUI_CONFIRM, {
          dismissible: true,
          closeable: true,
          size: 's',
          data,
        })
        .subscribe((userResponse) => {
          if (userResponse) {
            this.httpService.deleteProfile().subscribe({
              next: () => {
                this.authenticationService.logout();
                this.router.navigate(['/']);
              },
              error: (err) =>
                this.alert
                  .open(err.message, { appearance: NotificationTypes.Error })
                  .subscribe(),
            });
          } else {
            close();
          }
        }),
    );
  };

  onSubmitChangePass = () => {
    if (this.changePassForm.valid) {
      const formData = this.changePassForm.value;

      const changePass = this.httpService
        .changePass({
          oldPassword: String(formData.oldPassword),
          password: String(formData.confirmPassword),
        })
        .subscribe({
          next: (data: any) => {
            this.changePassForm.reset();
            this.alert
              .open(data.message, { appearance: NotificationTypes.Success })
              .subscribe();
          },
          error: (err: any) => {
            this.changePassForm.controls.oldPassword.setErrors({
              invalid: true,
            });

            this.alert
              .open(err.message, { appearance: NotificationTypes.Error })
              .subscribe();
          },
        });

      this.subscriptions.push(changePass);
    } else {
      this.changePassForm.markAllAsTouched();
      this.alert
        .open('Форма заполнена не корректно', {
          appearance: NotificationTypes.Error,
        })
        .subscribe();
    }
  };
}
