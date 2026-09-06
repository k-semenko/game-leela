import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  CellsInterface,
  GameInterface,
  GameStateInterface,
  MovesInterface,
  MoveType,
  PlayerInterface,
  UserInterface,
  WsGameInterface,
} from '../../../interface';
import {
  diceClass,
  diceDialogInitState,
  NotificationTypes,
  WsEvents,
} from '../../../constants';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { WsService } from '../../../services/ws.service';
import { HttpService } from '../../../services/http.service';
import { formattedDate } from '../../../helpers/date.helper';
import { AuthenticationService } from '../../../services/authentication.service';
import { environment } from '../../../../environments/environment';
import { setClipboard } from '../../../helpers/string.helper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaHelper } from '../../../helpers/media.helper';
import { MetaService } from '../../../services/meta.service';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { DiceModalInterface } from './dice-modal.interface';

// TODO: При окончании игры всеми игроками нужно закрывать все попапы и
//  с ходами тоже + 51 клетка

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.sass'],
  providers: [MediaHelper],
})
export class GameFieldComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[] = [];
  readonly gameField: CellsInterface[][] = [];
  cellsData: CellsInterface[] = [];
  user: UserInterface | null = null;
  gameId: string = document.URL.split('/').pop()!;
  gameData: GameInterface | null = null;
  selectedPlayer: PlayerInterface | null = null;
  changePlayersAutomatically = true;

  protected diceDialogState: DiceModalInterface = diceDialogInitState;
  showMovesDialog: boolean = false;
  showLoader: boolean = false;
  loaderText: string = '';
  dice: number = 1;
  playerMovesSequence: number[] = [];
  lastMove: MovesInterface | null = null;
  moveType: MoveType = MoveType.DICE;
  private selectedCell: number = 0;
  private oldPosition: number = 0;
  protected showDiceDialog = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AuthenticationService)
    protected readonly authenticationService: AuthenticationService,
    @Inject(MediaHelper) protected mediaHelper: MediaHelper,
    private webSocket: WsService,
    private router: Router,
    private readonly meta: MetaService,
  ) {
    meta.removeMetaTags();

    this.user = this.authenticationService.currentUser;
    this.wsHandler();
  }

  ngOnInit() {
    this.showLoader = true;

    const gameIdNumbered = Number(this.gameId);
    if (isNaN(gameIdNumbered)) {
      this.Alert('Не удалось найти игру', NotificationTypes.Error);
      this.router.navigate(['/']);
      return;
    }

    const getGame = this.httpService.getGame(gameIdNumbered).subscribe({
      next: (data) => {
        const player = data.players.find((pl) => pl.userId === this.user?.id);

        if (
          data.user?.id !== this.user?.id &&
          !player &&
          !this.authenticationService.isAdmin()
        ) {
          this.router.navigateByUrl(`/game/connect?gameId=${data.id}`);
        }

        this.gameData = data;
        document.title = `${this.gameData?.name}`;

        if (this.gameData?.moves && this.gameData.moves.length > 0) {
          this.lastMove = this.gameData.moves.at(0)!;
        }

        const gameState = this.gameData.state;
        if (gameState) {
          this.selectedPlayer =
            this.gameData.players.find(
              (p) => p.id === gameState.selectedPlayer,
            ) ?? null;

          this.playerMovesSequence = this.gameData.state.moveSequence ?? [];
          this.diceDialogState =
            this.gameData.state.diceDialogState ?? diceDialogInitState;

          this.showMovesDialog = this.gameData.state.showMovesDialog ?? false;
        }

        this.subscriptions.push(
          this.httpService.getCellsData().subscribe((data) => {
            this.cellsData = data;

            this.generateGameField();
            this.checkPlayerEnter();
            this.showLoader = false;
          }),
        );
      },
      error: (err) => console.log(err),
    });

    this.subscriptions.push(getGame);
  }

  ngOnDestroy() {
    this.webSocket.disconnect();
    this.subscriptions.forEach((item) => item.unsubscribe());
  }

  ngAfterViewInit() {}

  wsHandler = () => {
    if (!this.user) return;

    this.webSocket.connect(this.gameId, this.user);

    this.webSocket.socket.onAny((event, data: WsGameInterface | any) => {
      const gameId = event.split('-').at(-1);
      if (gameId !== this.gameId) return;

      event = event.replace(`-${gameId}`, '');

      switch (event) {
        case WsEvents.MOVE:
          this.lastMove = data.lastMove;
          this.gameData?.moves.unshift(data.lastMove);
          this.setPlayerPosition(data.lastMove.to);
          break;

        case WsEvents.SELECT_PLAYER:
          this.selectedPlayer = data.player;
          this.playerMovesSequence = [];
          break;

        case WsEvents.PLAYER_ACTIVATOR:
          console.log('playerActivator', data.player);

          if (!this.gameData?.players) return;

          this.selectedPlayer = data.player;
          this.gameData.players = this.gameData?.players.map((p) => {
            if (p.id === data.player.id) {
              return data.player;
            }
            return p;
          })!;

          this.activatePlayerAction(data.active, true);
          this.Alert(
            `Игрок <strong>'${data.player.username}'</strong>` +
              `${data.active ? ' вошел в игру' : ' вышел из игры'}.`,
            NotificationTypes.Info,
          );
          break;

        case WsEvents.PLAYER_ENTER:
          const player = this.gameData?.players.find(
            (p) => p.id === data.player.id,
          );

          if (!player) {
            this.gameData?.players.push(data.player);
            this.Alert(
              `<strong>${data.player.username} вошел в игру.</strong>`,
              NotificationTypes.Info,
            );
          }
          break;

        case WsEvents.SHOW_LOADER:
          this.showLoader = data.show ?? false;
          this.loaderText = data.message ?? '';
          break;

        case WsEvents.END_GAME:
          this.gameData!.gameEnd = true;
          this.selectedPlayer = null;
          this.showEndGameDialog();
          break;

        case WsEvents.LOG:
          // TODO: Выпилить только для админов
          // this.Alert(data.message ?? '', NotificationTypes.Info, 5000);
          break;

        case WsEvents.MOVE_SEQUENCE:
          this.playerMovesSequence = data.movesSequence ?? [];
          this.showMovesDialog = data.showMovesDialog ?? false;
          break;

        case WsEvents.DICE_DIALOG_STATE:
          if (this.isGameOwner !== this.isPlayerTurn)
            this.diceDialogState = data;
          break;

        default:
          this.Alert(`Неизвестный WS event ${event}`);
          break;
      }
    });
  };

  // region Getters
  get WsDTO(): WsGameInterface {
    return {
      gameId: Number(this.gameId),
      dice: this.dice,
      player: this.selectedPlayer!,
      active: true,
      lastMove: this.lastMove!,
      movesSequence: this.playerMovesSequence,
      showMovesDialog: this.showMovesDialog,
    };
  }

  get playerChip(): HTMLElement {
    const chip: HTMLElement = document.querySelector(
      `tui-avatar[data-player-id="${this.selectedPlayer?.id}"]`,
    )!;
    return chip!;
  }

  get moveDirection(): Element {
    return document.querySelector(
      `tui-avatar-stack[data-position='${this.selectedCell}']`,
    )!;
  }

  get playerChipPosition() {
    return Number(
      this.playerChip?.parentElement?.getAttribute('data-position'),
    );
  }

  get isGameOwner() {
    return (
      this.gameData?.user?.id === this.user?.id ||
      this.authenticationService.isAdmin()
    );
  }

  /** Ход текущего пользователя */
  get isPlayerTurn() {
    const playerTurn = this.selectedPlayer?.userId === this.user?.id;
    this.showDiceDialogHandler(playerTurn);
    return playerTurn;
  }

  // endregion Getters

  private showDiceDialogHandler = (playerTurn: boolean = false) => {
    this.showDiceDialog = this.isGameOwner ? this.showDiceDialog : playerTurn;
  };

  updateLastMoveCellInfo = () => {
    if (!this.selectedPlayer) return;
    const moveCellInfo = this.cellsData.find(
      (c) => c.number == this.selectedCell,
    );

    const movesLength = this.gameData?.moves?.length ?? 0;

    this.lastMove = {
      id: movesLength + 1,
      player: {
        id: this.selectedPlayer?.id,
        username: this.selectedPlayer?.username,
      },
      from: this.oldPosition ?? 0,
      to: this.selectedCell ?? 0,
      type: this.moveType,
      cellInfo: {
        title: moveCellInfo?.title ?? '',
        description: moveCellInfo?.description ?? '',
      },
    };

    this.gameData?.moves.unshift(this.lastMove);
    this.httpService.updateMoves(this.gameData!);

    this.moveType =
      this.moveType === MoveType.AUTO ? MoveType.DICE : this.moveType;
  };

  checkPlayerEnter = () => {
    if (
      !this.isGameOwner &&
      !this.gameData?.gameEnd &&
      !this.authenticationService.isAdmin()
    ) {
      const currentPlayer = this.gameData?.players.find(
        (p) => p?.userId === this.user?.id,
      )!;

      this.webSocket.playerEnterEmitter(currentPlayer);
    }
  };

  setMoveType = (moveType: MoveType) => {
    this.moveType = moveType;
  };

  setEndGame = () => {
    if (!this.gameData) return;
    this.gameData!.gameEnd = true;
    this.selectedPlayer = null;

    this.webSocket.endGameEmitter(this.WsDTO);
    this.httpService.setEndGame(this.gameData);
  };

  updatePlayerData = () => {
    if (!this.gameData) return;
    if (!this.selectedPlayer) return;
    if (this.gameData?.gameEnd) return this.Alert('Игра окончена!');

    this.httpService.updatePlayerData(this.selectedPlayer);
  };

  updateDiceLayout = (clear: boolean = false) => {
    if (clear) this.dice = 1;
    const diceElement = document.querySelector('.dice');
    diceElement?.setAttribute('class', diceClass[this.dice - 1]);
  };

  Alert = (
    message: string,
    status: NotificationTypes = NotificationTypes.Error,
    autoClose?: number | boolean,
  ) => {
    this.subscriptions.push(
      this.alerts
        .open(message, {
          appearance: status,
          autoClose: autoClose === false ? 0 : (3000 ?? 3000),
          closeable: true,
        })
        .subscribe(),
    );
  };

  quitGameDialog = () => {
    const data: TuiConfirmData = {
      content: `<strong>Ваша позиция:</strong> ${this.selectedCell}<br><br>
                ${this.lastMove?.cellInfo.description}<br><br>
                Вы можете закончить игру прямо сейчас или продолжить дальше.<br><br>
                <strong>Хотите продолжить?</strong>`,
      yes: 'Да',
      no: 'Нет',
    };

    this.subscriptions.push(
      this.dialogs
        .open<boolean>(TUI_CONFIRM, {
          dismissible: false,
          closeable: false,
          size: 's',
          data,
        })
        .subscribe((userResponse) => {
          if (userResponse) {
            this.webSocket.log(
              `Игрок '${this.selectedPlayer?.username}' продолжает игру!`,
            );
            this.updatePlayerData();
          } else {
            this.activatePlayerAction(false);

            this.webSocket.log(
              `Игрок '${this.selectedPlayer?.username}' закончил игру!`,
            );

            this.checkEndingGame();
            this.changePlayer();
          }
        }),
    );
  };

  endGameDialog = (
    label: string,
    content: string,
    buttonText: string = 'OK',
  ) => {
    this.subscriptions.push(
      this.dialogs
        .open(content, {
          label: label,
          size: 's',
          data: { button: buttonText },
        })
        .subscribe(),
    );
  };

  activatePlayerAction = (activate: boolean, wsAction: boolean = false) => {
    if (!this.selectedPlayer) return;
    this.selectedPlayer.isActive = activate;

    // Если действие не для WS, то обновляем в БД и отправляем event
    if (!wsAction) {
      this.updatePlayerData();
      this.webSocket.playerActivatorEmitter(this.WsDTO, activate);
    }
  };

  showEndGameDialog = () => {
    this.showMovesDialog = false;

    this.endGameDialog(
      'ИГРА ОКОНЧЕНА',
      `Все игроки успешно прошли игру!<br><br>
                <strong>Время начала: </strong>${formattedDate(
                  'DD.MM.YYYY HH:mm',
                  this.gameData?.createdAt,
                )}<br>
                <strong>Время окончания: </strong>${formattedDate()}`,
      'Закрыть',
    );
  };

  configsTrigger = (event: any, config: string) => {
    switch (config) {
      case 'showDiceDialog':
        this.showDiceDialogOption(event);
        break;
      default:
        alert('Для данной настройки нет обработки');
        break;
    }
  };

  showDiceDialogOption = (event: any) => {
    if (this.selectedPlayer) {
      this.dialogs
        .open(event, {
          size: 'l',
          dismissible: false,
          closeable: this.isGameOwner,
        })
        .subscribe();
    } else {
      this.Alert('Игрок не выбран', NotificationTypes.Error);
    }
  };

  shareGame = async () => {
    let text = `Добрый день!\n\nПриглашаю присоединится к игре ЛИЛА: '${this.gameData?.name}'!\n\n`;
    let url =
      environment.apiUrl + `game/connect?gameId=${this.gameData?.id}&code=`;

    this.subscriptions.push(
      this.httpService.getGameCode(this.gameId).subscribe((data: any) => {
        url += data.code;
        text += url;
        setClipboard(text).then(() => {
          this.subscriptions.push(
            this.alerts
              .open('Ссылка для присоединения к игре скопирована!')
              .subscribe(),
          );
        });
      }),
    );
  };

  generateGameField = (): void => {
    let array: CellsInterface[] = [];
    let reverse = false;
    for (let i = 1; i <= 72; i++) {
      array.push(this.cellsData.find((c) => c.number == i)!);

      if (i % 9 == 0) {
        if (reverse) {
          array.reverse();
        }

        this.gameField.push(array);
        array = [];
        reverse = !reverse;
      }
    }

    this.gameField.reverse();
  };

  getPlayers = (position: number): PlayerInterface[] => {
    return this.gameData?.players.filter((pl) => pl.position === position)!;
  };

  selectPlayerFromField = (event: any) => {
    if (this.gameData?.gameEnd) return this.Alert('Игра окончена!');
    if (!this.isGameOwner)
      return this.Alert(
        'Сменить игрока может только владелец игры!',
        NotificationTypes.Error,
      );

    const userId = Number(event.target.getAttribute('data-user'));

    if (this.selectedPlayer?.id === userId) {
      event.target.classList.remove('selected');
      this.selectedPlayer = null;

      this.webSocket.selectedPlayerEmitter(this.WsDTO);
    } else {
      this.selectedPlayer = this.gameData?.players.find(
        (p) => p.id === userId,
      )!;
      this.oldPosition = this.selectedPlayer?.position;
      this.playerMovesSequence = [];
      this.webSocket.selectedPlayerEmitter(this.WsDTO);
    }
  };

  setNextChipPosition = (
    cell: number | null = null,
    dice: number | null = null,
    fromField: boolean = false,
  ) => {
    if (this.gameData?.gameEnd) return this.Alert('Игра окончена!');
    if (!this.selectedPlayer) return this.Alert('Игрок не выбран');

    this.oldPosition = this.playerChipPosition;

    if (dice) {
      this.selectedCell = this.oldPosition + dice;
    }

    if (cell) {
      if (fromField && !this.isGameOwner) {
        return;
      }

      if (this.selectedPlayer.position == cell) {
        return;
      }

      if (fromField) {
        this.moveType = MoveType.MANUAL;
      }

      if (!this.selectedPlayer.isActive) this.activatePlayerAction(true);
      this.selectedCell = cell;
    }

    this.checkPositionAndMove();
  };

  setPlayerPosition = (selectedCell?: number) => {
    if (!this.gameData) return;
    if (!this.selectedPlayer) return;

    this.selectedPlayer.position = selectedCell ?? this.selectedCell!;

    this.gameData.players = this.gameData.players.map((value) => {
      if (value.id === this.selectedPlayer?.id) {
        return this.selectedPlayer;
      } else {
        return value;
      }
    });
  };

  rollTheDice = (diceNumber?: number) => {
    if (this.gameData?.gameEnd) return this.Alert('Игра окончена!');
    if (!this.selectedPlayer) return this.Alert('Игрок не выбран');
    if (!this.isPlayerTurn && !this.isGameOwner)
      return this.Alert('Сейчас ход другого игрока');

    this.dice = !diceNumber ? Math.floor(Math.random() * 6) + 1 : diceNumber;

    this.updateDiceLayout();

    if (
      this.playerMovesSequence.length === 0 &&
      this.selectedPlayer.position === 1 &&
      !this.selectedPlayer.isActive &&
      this.dice !== 6
    ) {
      this.showMovesDialog = true;
      this.diceDialogState.sixOnStart = true;
      this.diceDialogState.exitDialog = true;
      this.updateGameState();
      this.webSocket.diceDialogStateEmitter(this.diceDialogState);
      return;
    }

    if (this.dice === 6) {
      this.playerMovesSequence.push(6);
      this.updateGameState();

      if (
        this.playerMovesSequence.length === 3 &&
        this.selectedPlayer?.position === 1 &&
        this.selectedPlayer?.isActive === false &&
        this.playerMovesSequence.every((i) => i === 6)
      ) {
        this.clearUserMoves();
        this.Alert(
          'Три шестерки в начале игры, остаемся на первой клетке',
          NotificationTypes.Warning,
        );
        return this.activatePlayerAction(true);
      }
      return;
    } else {
      this.playerMovesSequence.push(this.dice);
      this.updateGameState();
    }

    if (this.playerMovesSequence.length === 1) {
      this.showMovesDialog = true;
      this.updateGameState();
    } else {
      const movesSequence = this.playerMovesSequence.filter(
        (_, i) => i !== this.playerMovesSequence.length - 1,
      );
      const movesSequenceAsSame = movesSequence.every((i) => i === 6);

      // Более 3-х шестерок в последовательности или
      // последовательности длинной 3 и менее - игрок проходит все шаги
      if (
        (movesSequenceAsSame && movesSequence.length > 3) ||
        this.playerMovesSequence.length <= 3
      ) {
        this.showMovesDialog = true;
        this.updateGameState();
      }

      // 3 шестерки не вначале игры и 4 значения в последовательности перемещают
      // пользователя на кол-во ячеек последнего элемента
      if (movesSequenceAsSame && movesSequence.length === 3) {
        this.playerMovesSequence = [this.playerMovesSequence.at(-1)!];
        this.showMovesDialog = true;
        this.updateGameState();
      }
    }
  };

  updateGameState = () => {
    const data: GameStateInterface = {
      selectedPlayer: this.WsDTO.player.id,
      showMovesDialog: this.showMovesDialog,
      moveSequence: this.playerMovesSequence,
      diceDialogState: this.diceDialogState,
    };

    this.webSocket.moveSequenceEmitter(this.WsDTO);
    this.httpService.updateGameState(this.WsDTO.gameId, data);
  };

  clearUserMoves = () => {
    this.playerMovesSequence = [];
    this.showMovesDialog = false;
    this.updateGameState();
    this.updateDiceLayout(true);
  };

  makeMoveAction = () => {
    let step = 0;
    if (this.playerMovesSequence.length === 0) {
      this.changePlayer();
      return this.clearUserMoves();
    } else {
      step = this.playerMovesSequence.at(0)!;
      this.playerMovesSequence = this.playerMovesSequence.filter(
        (v, i) => i !== 0,
      );

      this.updateGameState();
    }

    if (this.selectedPlayer?.position === 1 && !this.selectedPlayer?.isActive) {
      this.setNextChipPosition(6);
    } else {
      this.setNextChipPosition(null, step);
    }
  };

  checkPositionAndMove = (): void => {
    if (this.selectedCell > 72) {
      return;
    }

    this.move();
    this.checkUserEndingGame();
  };

  move = () => {
    if (!this.selectedPlayer) return this.Alert('Игрок не выбран');

    // Передвижение
    this.moveDirection.appendChild(this.playerChip);

    this.setPlayerPosition();
    this.updateLastMoveCellInfo();

    this.webSocket.moveEmitter(this.WsDTO);
  };

  changePlayer = (): any => {
    if (!this.gameData) return;
    if (this.gameData.gameEnd) return;
    if (!this.changePlayersAutomatically) {
      return;
    }

    // Сброс состояния модалки кубика
    this.diceDialogState = diceDialogInitState;

    const activePlayers = this.gameData.players.filter((p) => {
      return p.isActive || (!p.isActive && p.position === 1);
    });

    const playerIndex = activePlayers.findIndex(
      (pl) => pl.id === this.selectedPlayer?.id,
    );

    this.selectedPlayer =
      playerIndex < activePlayers.length - 1
        ? activePlayers[playerIndex + 1]
        : activePlayers[0];

    this.clearUserMoves();
    this.webSocket.selectedPlayerEmitter(this.WsDTO);
  };

  checkEndingGame = () => {
    const activePlayers = this.gameData?.players.filter(
      (pl) => pl.isActive || (!pl.isActive && pl.position === 1),
    )!;

    if (activePlayers.length === 0) {
      this.showEndGameDialog();
      this.setEndGame();
    }
  };

  checkUserEndingGame = () => {
    if (this.selectedCell === 51) {
      this.quitGameDialog();
    } else if (this.selectedCell === 68) {
      this.webSocket.log(
        `Игрок '${this.selectedPlayer?.username}' закончил игру!`,
      );

      this.activatePlayerAction(false);
      this.checkEndingGame();
    } else {
      this.updatePlayerData();
    }
  };

  /** Отправка состояния модалки кубика */
  diceDialogStateEmit(diceDialogState: DiceModalInterface) {
    if (this.isGameOwner !== this.isPlayerTurn) {
      this.webSocket.diceDialogStateEmitter(diceDialogState);
    }
  }
}
