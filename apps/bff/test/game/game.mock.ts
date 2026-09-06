import { allGamesExample } from './game.exaples';

export const GameServiceMock = {
  findAllGames() {
    return Promise.resolve(allGamesExample);
  },
};
