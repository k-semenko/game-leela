import { FieldInterface } from '../fields/fields.interface';
import { PlayerInterface, PlayerMapperDto } from '../players/player.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GameOwnerDto } from '../users/users.interface';
import { Games } from '../entity/games.entity';
import { DiceModalInterface } from '../events/dice-modal.interface';

export enum MoveType {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  DICE = 'DICE',
}

export interface GameInterface {
  id: number;
  name: string;
  field?: FieldInterface;
  moves: MovesInterface[];
  state: GameStateInterface;
  user?: {
    id: number;
    username: string;
  };
  players: PlayerInterface[];
  gameEnd: boolean;
  createdAt: string;
}

export interface MovesInterface {
  id: number;
  player: {
    id: number;
    username: string;
  };
  from: number;
  to: number;
  type: MoveType;
  cellInfo: {
    title: string;
    description: string;
  };
}

export interface GameStateInterface {
  selectedPlayer: number;
  moveSequence: number[];
  showMovesDialog: boolean;
  diceDialogState: DiceModalInterface;
}

export class UserIdDTO {
  @ApiProperty({
    title: 'ID',
    name: 'userId',
    description: 'ID пользователя',
    default: 1,
    type: Number,
  })
  id: number;
}

export class CreateGameDto {
  @ApiProperty({
    type: Games,
    description: 'Параметры игры',
  })
  game: Games;

  @ApiProperty({
    type: Boolean,
    description: 'Игропрактик, тоже играет',
    required: true,
  })
  alsoPlay: boolean;
}

export class GameEndDto {
  @ApiProperty({
    type: Number,
    description: 'ID игры',
    required: true,
  })
  id: number;

  @ApiProperty({
    type: Boolean,
    description: 'Игра завершена?',
    required: true,
  })
  gameEnd: boolean;
}

export class GamesDto {
  @ApiProperty({
    type: Number,
    description: 'ID игры',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Название игры',
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'Игра завершена?',
  })
  gameEnd: boolean;

  @ApiProperty({
    type: String,
    description: 'Игровое поле',
    required: false,
  })
  field: string;

  @ApiProperty({
    type: GameOwnerDto,
    description: 'Владелец игры',
    required: true,
  })
  user: GameOwnerDto;

  @ApiProperty({
    type: [PlayerMapperDto],
    description: 'Игроки игры',
    required: true,
  })
  players: [PlayerMapperDto];

  @ApiProperty({
    type: Date,
    description: 'Дата создания игра',
  })
  createdAt: string;
}
