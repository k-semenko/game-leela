import { FieldMovesInterface } from './interface';
import { DiceModalInterface } from './components/game/game-field/dice-modal.interface';

export const playersColors: string[] = [
  '#3682db',
  '#34b41f',
  '#b8474e',
  '#ff8a00',
  '#7b439e',
  '#9d6f64',
  '#2fad96',
  '#a0c5df',
];

export const diceClass = [
  'dice one',
  'dice two',
  'dice three',
  'dice four',
  'dice fifth',
  'dice six',
];

export const fieldAutomaticMoves: FieldMovesInterface[] = [
  { direction: true, from: 10, to: 23 },
  { direction: true, from: 17, to: 69 },
  { direction: true, from: 20, to: 32 },
  { direction: true, from: 22, to: 60 },
  { direction: true, from: 27, to: 41 },
  { direction: true, from: 28, to: 50 },
  { direction: true, from: 37, to: 66 },
  { direction: true, from: 45, to: 67 },
  { direction: true, from: 46, to: 62 },
  { direction: true, from: 54, to: 68 },

  { direction: false, from: 72, to: 51 },
  { direction: false, from: 63, to: 2 },
  { direction: false, from: 61, to: 13 },
  { direction: false, from: 55, to: 3 },
  { direction: false, from: 52, to: 35 },
  { direction: false, from: 44, to: 9 },
  { direction: false, from: 29, to: 6 },
  { direction: false, from: 24, to: 7 },
  { direction: false, from: 16, to: 4 },
  { direction: false, from: 12, to: 8 },
];

export enum NotificationTypes {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

export enum WsEvents {
  MOVE = 'move',
  SELECT_PLAYER = 'selected-player',
  PLAYER_ACTIVATOR = 'player-activator',
  PLAYER_ENTER = 'player-enter',
  SHOW_LOADER = 'show-loader',
  END_GAME = 'end-game',
  LOG = 'log',
  MOVE_SEQUENCE = 'moveSequence',
  DICE_DIALOG_STATE = 'diceDialogState',
}

export const mainMenu = [
  {
    label: '',
    items: [
      {
        label: 'Главная',
        icon: '@tui.key',
        routerLink: '/',
      },
      {
        label: 'Правила',
        icon: '@tui.map',
        routerLink: '/rules',
        disabled: false,
      },
      {
        label: 'Тарифы',
        icon: '@tui.shopping-bag',
        routerLink: '/prices',
        disabled: false,
      },
      {
        label: 'Помощь',
        icon: '@tui.circle-help',
        routerLink: '/help',
        disabled: false,
      },
    ],
  },
];

export const profileActionsButtons = [
  {
    description: 'Присоединиться к созданной игре',
    header: 'Присоединиться',
    icon: '@tui.user',
    routerLink: '/game/connect',
    type: 'base',
    hideText: true,
  },
  {
    description: 'Email | ФИО | Удаление',
    header: 'Настройки профиля',
    icon: '@tui.settings',
    routerLink: '/profile/settings',
    type: 'info',
    hideText: true,
  },
  {
    description: 'Выход из учетной записи',
    header: 'Выйти из профиля',
    icon: '@tui.log-out',
    routerLink: '/auth/logout',
    type: 'negative',
    hideText: true,
  },
];

export const tariffsIcons: string[] = [
  '@tui.inbox',
  '@tui.archive',
  '@tui.package',
];

export const tariffsTypes: string[] = ['info', 'success', 'error'];

export const diceDialogInitState: DiceModalInterface = {
  preview: true,
  exitDialog: false,
  showLoader: false,
  nextStepAuto: false,
  nextStepCell: 0,
  fieldEnd: false,
  sixOnStart: false,
};
