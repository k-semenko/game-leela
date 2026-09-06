import { Inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { PlayerInterface, UserInterface, WsGameInterface } from '../interface';
import { environment } from '../../environments/environment';
import { TuiAlertService } from '@taiga-ui/core';
import { DiceModalInterface } from '../components/game/game-field/dice-modal.interface';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  socket!: Socket;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
  ) {}

  connect = (gameId: string, user: UserInterface) => {
    this.socket = io(environment.apiUrl, {
      reconnection: true,
      query: { gameId: gameId, username: user.username },
    });

    this.socket.on('connect_failed', () =>
      console.log('[Connection Failed] WS'),
    );
    this.socket.on('connect_error', (err) => console.error(err));
    this.socket.on('connect_failed', (err) => console.error(err));
    this.socket.on('exception', (data) =>
      console.error('[Exception] WS', data),
    );

    this.socket.on('connect', () =>
      console.info('%c[Connect] WS', 'color: green'),
    );
    this.socket.on('disconnect', () => console.log('[Disconnect] WS'));
  };

  private emit = (event: string, data: WsGameInterface | any) => {
    this.socket.emit(event, data);
  };

  disconnect = () => {
    this.socket.disconnect();
  };

  log = (message: string) => {
    this.emit('log', { message: message });
  };

  playerEnterEmitter = (player: PlayerInterface) => {
    this.emit(`player-enter`, {
      player: player,
    });
  };

  endGameEmitter = (data: WsGameInterface) => {
    this.emit('end-game', { gameId: data.gameId });
  };

  selectedPlayerEmitter = (data: WsGameInterface) => {
    this.emit('selected-player', {
      player: data.player,
    });
  };

  playerActivatorEmitter = (data: WsGameInterface, active: boolean) => {
    this.emit('player-activator', {
      player: data.player,
      active: active,
    });
  };

  moveEmitter = (data: WsGameInterface) => {
    this.emit('move', {
      lastMove: data.lastMove,
    });
  };

  moveSequenceEmitter = (data: WsGameInterface) => {
    this.emit('moveSequence', {
      movesSequence: data.movesSequence,
      showMovesDialog: data.showMovesDialog,
    });
  };

  diceDialogStateEmitter(diceDialogState: DiceModalInterface) {
    this.emit('diceDialogState', diceDialogState);
  }
}
