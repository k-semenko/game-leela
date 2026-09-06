import { Component, Inject, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import {
  GameInterface,
  PlayerInterface,
  UserInterface,
} from '../../../interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationTypes, playersColors } from '../../../constants';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-connect-game',
  templateUrl: './connect-game.component.html',
  styleUrls: ['./connect-game.component.sass'],
})
export class ConnectGameComponent implements OnInit {
  user: UserInterface | null = null;
  game: GameInterface | null = null;
  gameForm = new FormGroup({
    gameId: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(TuiAlertService) private readonly alert: TuiAlertService,
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    if (queryParams.get('gameId'))
      this.gameForm.controls.gameId.setValue(queryParams.get('gameId'));
    if (queryParams.get('code'))
      this.gameForm.controls.code.setValue(queryParams.get('code'));

    this.user = this.authenticationService.currentUser;
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      const form = this.gameForm.controls;

      this.httpService
        .getGameByCode(Number(form.gameId.value), form.code.value!)
        .subscribe({
          next: (data: GameInterface) => {
            this.game = data;
            const player = data.players.find(
              (pl: PlayerInterface) => pl.userId == this.user?.id,
            );
            if (data.user?.id === this.user?.id || player) {
              this.router.navigateByUrl(`/game/${data.id}`);
            } else {
              if (!this.game.gameEnd) {
                this.createGameUser();
              } else {
                this.alert
                  .open('Нельзя присоединиться к завершенной игре!', {
                    appearance: NotificationTypes.Error,
                    autoClose: 3000,
                    closeable: true,
                  })
                  .subscribe();
              }
            }
          },
          error: (err) => {
            console.log('Error', err);
            this.alert
              .open(err.message, {
                appearance: NotificationTypes.Error,
                autoClose: 3000,
                closeable: true,
              })
              .subscribe();
            return;
          },
        });
    } else {
      this.gameForm.markAllAsTouched();
      this.alert
        .open('Форма заполнена не корректно!', {
          appearance: NotificationTypes.Error,
          autoClose: 3000,
          closeable: true,
        })
        .subscribe();
    }
  }

  createGameUser = () => {
    const playerColors: string[] = [];
    this.game?.players.forEach((item) => {
      playerColors.push(item.color);
    });

    const player = {
      color: playersColors.find((color) => !playerColors.includes(color)),
      user: this.user?.id,
      position: 1,
      isActive: false,
      game: Number(this.gameForm.controls.gameId.value),
    };

    this.httpService.addGamePlayer(player, this.game?.id!);
  };
}
