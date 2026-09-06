import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackReqInterface } from './help.interface';
import { Subscription } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from '../../../services/http.service';
import { MetaService } from '../../../services/meta.service';
import { UserProfileInterface } from '../../../interface';
import { NotificationTypes } from '../../../constants';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent implements OnInit, OnDestroy {
  showFeedbackLoader: boolean = false;

  constructor(
    @Inject(AuthenticationService)
    authService: AuthenticationService,
    @Inject(HttpService)
    private readonly httpService: HttpService,
    private readonly alert: TuiAlertService,
    private readonly meta: MetaService,
  ) {
    if (authService.currentUser) {
      this.subscriptions.push(
        this.httpService.profile().subscribe({
          next: (data) => {
            this.user = data;
            this.feedbackForm.controls.email.patchValue(data.email ?? null);
          },
        }),
      );
    }
  }

  subscriptions: Subscription[] = [];
  user: UserProfileInterface | null = null;
  feedbackDialogShow: boolean = false;
  subjects: string[] = [
    'Вопрос',
    'Предложение по улучшению',
    'Ошибка в работе сайта',
    'Другое',
  ];

  feedbackForm = new FormGroup({
    subject: new FormControl(this.subjects[0], [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
      Validators.maxLength(124),
    ]),
    text: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000),
    ]),
    user: new FormControl(),
  });

  showDialog(): void {
    this.feedbackDialogShow = true;
  }

  onSubmit = () => {
    if (this.feedbackForm.valid) {
      this.showFeedbackLoader = true;
      const ctr = this.feedbackForm.controls;

      const data: FeedbackReqInterface = {
        email: ctr.email.value!,
        subject: ctr.subject.value!,
        text: ctr.text.value!,
        user: this.user ? this.user.id : null,
      };
      this.subscriptions.push(
        this.httpService.addFeedback(data).subscribe({
          next: (data) => {
            this.alert
              .open(data.message, { appearance: NotificationTypes.Success })
              .subscribe();

            this.feedbackForm.controls.text.reset();
            this.feedbackDialogShow = false;
            this.showFeedbackLoader = false;
          },
        }),
      );
    } else {
      this.feedbackForm.markAllAsTouched();
    }
  };

  ngOnInit() {
    this.meta.updateMetaTags([
      { name: 'title', content: 'Помощь и обратная связь' },
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
