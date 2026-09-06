import { GameInterface, MovesInterface } from '../interface';

export const sortGamesByCreateDesc = (a: GameInterface, b: GameInterface) => {
  return a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0;
};

export const sortMovesByIdDesc = (a: MovesInterface, b: MovesInterface) => {
  return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
};
