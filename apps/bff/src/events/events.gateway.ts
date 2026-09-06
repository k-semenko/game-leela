import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets/decorators/connected-socket.decorator';
import { WsGameInterface } from './ws-game.interface';
import * as process from 'process';
import { DiceModalInterface } from './dice-modal.interface';

class MySocket extends Socket {
  gameId: number;
  username: string;
}

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  afterInit() {
    console.log(`WS Server Init on port ${Number(process.env.WS_PORT)}`);
  }

  handleConnection(client: MySocket) {
    client.gameId = Number(client.handshake.query.gameId);
    client.username = String(client.handshake.query.username);

    // Всем, за исключением этого клиента
    client.broadcast.emit(`log-${client.gameId}`, {
      message: `User '${client.username}' connected`,
    });
  }

  handleDisconnect(client: MySocket) {
    client.broadcast.emit(`log-${client.gameId}`, {
      message: `User '${client.username}' disconnected`,
    });
  }

  @SubscribeMessage('dice')
  handleDice(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: any,
  ): void {
    client.broadcast.emit(`dice-${client.gameId}`, { dice: payload.dice });
  }

  @SubscribeMessage('move')
  handleMove(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: WsGameInterface,
  ) {
    const data: WsGameInterface = {
      lastMove: payload.lastMove,
    };

    client.broadcast.emit(`move-${client.gameId}`, data);
  }

  @SubscribeMessage('selected-player')
  handleSelectedPlayer(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: WsGameInterface,
  ) {
    client.broadcast.emit(`selected-player-${client.gameId}`, {
      player: payload.player,
    });
  }

  @SubscribeMessage('player-enter')
  handlePlayerEnter(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: any,
  ) {
    client.broadcast.emit(`player-enter-${client.gameId}`, {
      player: payload.player,
    });
  }

  @SubscribeMessage('player-activator')
  handlePlayerActivator(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: WsGameInterface,
  ) {
    const data: WsGameInterface = {
      player: payload.player,
      active: payload.active,
    };
    client.broadcast.emit(`player-activator-${client.gameId}`, data);
  }

  @SubscribeMessage('moveSequence')
  handleMovesSequence(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: WsGameInterface,
  ) {
    const data: WsGameInterface = {
      movesSequence: payload.movesSequence,
      showMovesDialog: payload.showMovesDialog,
    };
    client.broadcast.emit(`moveSequence-${client.gameId}`, data);
  }

  @SubscribeMessage('end-game')
  handleEndGame(@ConnectedSocket() client: MySocket) {
    client.broadcast.emit(`end-game-${client.gameId}`);
  }

  @SubscribeMessage('diceDialogState')
  handleDiceDialogState(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: DiceModalInterface,
  ) {
    client.broadcast.emit(`diceDialogState-${client.gameId}`, payload);
  }

  @SubscribeMessage('identity')
  async identity(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: number,
  ) {
    console.log(client, payload);
  }

  @SubscribeMessage('log')
  handleMessage(
    @ConnectedSocket() client: MySocket,
    @MessageBody() payload: { message: string },
  ) {
    this.wss.emit(`log-${client.gameId}`, { message: payload.message });
  }
}
