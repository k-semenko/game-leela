import { PaymentsInterface } from './components/profile/payments.interface';
import { DiceModalInterface } from './components/game/game-field/dice-modal.interface';

interface MenuItemInterface {
  label: string;
  icon?: string;
  routerLink: string;
  disabled?: boolean;
}

export interface MenuGroupInterface {
  label?: string;
  items: MenuItemInterface[];
}

export interface FieldInterface {
  id: number;
  title: string;
  description: string;
  url: string;
  interface: boolean;
}

export interface PlayerInterface {
  id: number;
  username: string;
  color: string;
  position: number;
  isActive: boolean;
  userId: number;
}

export interface GameInterface {
  id: number;
  name: string;
  field: FieldInterface;
  moves: MovesInterface[];
  state: GameStateInterface;
  user?: UserInterface;
  players: PlayerInterface[];
  gameEnd: boolean;
  createdAt: string;
}

export interface GameStateInterface {
  selectedPlayer: number;
  moveSequence: number[];
  showMovesDialog: boolean;
  diceDialogState: DiceModalInterface;
}

export interface CreateGameInterface {
  game: {
    name: string;
    field: number;
    user: number;
    code: string;
  };
  alsoPlay: boolean;
}

export enum MoveType {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  DICE = 'DICE',
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

export interface ProfileGamesInterface {
  my: {
    index: number;
    games: GameInterface[];
  };
  withMe: {
    index: number;
    games: GameInterface[];
  };
}

export interface FieldMovesInterface {
  direction: boolean;
  from: number;
  to: number;
}

export interface WsGameInterface {
  gameId: number;
  dice: number;
  player: PlayerInterface;
  active: boolean;
  lastMove: MovesInterface;
  movesSequence?: number[];
  showMovesDialog?: boolean;
  show?: boolean;
  message?: string;
}

export interface SignupUserInterface {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginUserInterface {
  username: string;
  password: string;
}

export enum UserRole {
  User = 'USER',
  Curator = 'CURATOR',
  Admin = 'ADMIN',
}

export interface UserInterface {
  id: number;
  username?: string;
  role?: UserRole;
  payments?: PaymentsInterface[];
  exp?: number;
  tg?: number;
}

export interface UserProfileInterface extends UserInterface {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  freeGames?: number;
}

export interface CellsInterface {
  id: number;
  number: number;
  title: string;
  description: string;
}
