import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreateGameInterface,
  FieldInterface,
  UserInterface,
} from '../../../interface';
import { HttpService } from '../../../services/http.service';
import { generateString } from '../../../helpers/string.helper';
import { formattedDate } from '../../../helpers/date.helper';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { NotificationTypes } from '../../../constants';
import { MediaHelper } from '../../../helpers/media.helper';

@Component({
  selector: 'app-create',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.sass'],
  providers: [MediaHelper],
})
export class CreateGameComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loader: boolean = true;
  user: UserInterface | null = null;
  fieldPreview = '';
  createdTime = formattedDate();
  newGameForm = new FormGroup({
    gameName: new FormControl(`Игра ${this.createdTime}`, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]),
    code: new FormControl(generateString(6), [Validators.required]),
    gameField: new FormControl(),
    alsoPlay: new FormControl(false, [Validators.required]),
  });
  protected gameFields: FieldInterface[] = [];

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    protected MediaHelper: MediaHelper,
  ) {
    this.user = this.authenticationService.currentUser;
    const fieldsSubscription = this.httpService.getFields().subscribe({
      next: (fields: FieldInterface[]) => {
        this.gameFields = fields;
        this.fieldPreview = fields.at(0)?.url ?? '';
        this.loader = false;

        setTimeout(
          () =>
            this.newGameForm.controls.gameField.setValue(this.gameFields[0].id),
          500,
        );
      },
      error: (err) =>
        this.alerts
          .open(err.message, { appearance: NotificationTypes.Error })
          .subscribe(),
    });
    this.subscriptions.push(fieldsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  ngOnInit() {}

  getFieldPreview(fieldId: number): string {
    const fieldItem: FieldInterface | undefined = this.gameFields.find(
      (f) => f.id == fieldId,
    );
    this.fieldPreview = fieldItem?.url!;
    return this.fieldPreview;
  }

  createNewGame = () => {
    const form = this.newGameForm.value;
    const gameData: CreateGameInterface = {
      game: {
        name: String(form.gameName),
        field: form.gameField,
        user: Number(this.user?.id),
        code: String(form.code?.trim()),
      },
      alsoPlay: Boolean(form.alsoPlay),
    };

    this.subscriptions.push(
      this.httpService.createNewGame(gameData).subscribe({
        next: (data) => {
          this.router.navigateByUrl(`/game/${data?.id}`);
        },
        error: (err) =>
          this.alerts
            .open(err.message, {
              appearance: NotificationTypes.Error,
              autoClose: 0,
            })
            .subscribe(),
      }),
    );
  };

  onSubmit(): void {
    if (this.newGameForm.valid) {
      this.createNewGame();
    } else {
      this.newGameForm.markAllAsTouched();
    }
  }
}
