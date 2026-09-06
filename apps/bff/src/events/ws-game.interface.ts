import { MovesInterface } from '../game/game.interface';
import { PlayerInterface } from '../players/player.dto';

export interface WsGameInterface {
  gameId?: number;
  dice?: number;
  player?: PlayerInterface;
  active?: boolean;
  lastMove?: MovesInterface;
  position?: number;
  movesSequence?: number[];
  showMovesDialog?: boolean;
}
