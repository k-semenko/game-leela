import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TUI_PASSWORD_TEXTS,
  TUI_VALIDATION_ERRORS,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { of } from 'rxjs';
import { passwordValidator } from '../../../helpers/string.helper';
import { HttpClient } from '@angular/common/http';
import { TuiAlertService } from '@taiga-ui/core';
import { NotificationTypes } from '../../../constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass'],
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
export class ChangePasswordComponent {
  resetToken: string | null = null;
  emailSend: boolean = false;
  showLoader: boolean = false;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
  });

  resetPassForm = new FormGroup({
    resetToken: new FormControl('', [Validators.required]),
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly httpClient: HttpClient,
    private readonly alertService: TuiAlertService,
  ) {
    this.resetToken = this.route.snapshot.queryParamMap.get('resetToken');

    if (this.resetToken) {
      this.resetPassForm.patchValue({
        resetToken: this.resetToken,
      });
    }
  }

  onSubmitRequestChangePassForm = () => {
    if (this.emailForm.valid) {
      this.showLoader = true;

      this.httpClient
        .post('api/auth/change-pass', { email: this.emailForm.value.email })
        .subscribe({
          next: () => {
            this.emailSend = true;
          },
          error: (err: any) => {
            this.showLoader = false;

            this.alertService
              .open(err.message, { appearance: NotificationTypes.Error })
              .subscribe();
          },
        });
    } else {
      this.alertService
        .open('Форма заполнена не корректно', {
          appearance: NotificationTypes.Error,
        })
        .subscribe();
    }
  };

  onSubmitChangePass = () => {
    if (this.resetPassForm.valid) {
      this.showLoader = true;
      const requestData = {
        ...this.resetPassForm.value,
      };

      this.httpClient.patch('api/auth/change-pass', requestData).subscribe({
        next: () => {
          this.router
            .navigateByUrl('/auth')
            .then(() =>
              this.alertService
                .open('Пароль успешно изменен!', { autoClose: 5000 })
                .subscribe(),
            );
        },
        error: (err: any) => {
          this.showLoader = false;
          this.alertService
            .open(err.message, {
              appearance: NotificationTypes.Error,
              autoClose: 5000,
            })
            .subscribe();
        },
      });
    } else {
      this.alertService
        .open('Форма заполнена не корректно', {
          appearance: NotificationTypes.Error,
        })
        .subscribe();
    }
  };
}
