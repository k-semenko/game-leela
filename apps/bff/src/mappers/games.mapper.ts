import { GameInterface } from '../game/game.interface';
import { FieldInterface } from '../fields/fields.interface';
import { PlayerInterface } from '../players/player.dto';
import { User } from '../entity/user.entity';
import { Players } from '../entity/players.entity';
import { Fields } from '../entity/fields.entity';
import { Games } from '../entity/games.entity';

export class GamesMapper {
  private static nameMapper = (data: User) => {
    if (data?.lastName && data.firstName) {
      return `${data?.lastName} ${data?.firstName[0].toUpperCase()}.`;
    } else {
      return data?.username ?? null;
    }
  };

  private static playerMapper(players: Players[]): PlayerInterface[] {
    const playersArr: PlayerInterface[] = [];
    players.forEach((item) => {
      playersArr.push({
        id: item.id,
        username: this.nameMapper(item.user),
        color: item.color,
        position: item.position,
        isActive: item.isActive,
        userId: item.user.id,
      });
    });

    return playersArr;
  }

  private static fieldMapper(field: Fields): FieldInterface {
    return {
      id: field.id,
      title: field.title,
      description: field.descriptions,
      url: field.url,
      interface: field.interface,
    };
  }

  public static gameMapper(data: Games): GameInterface {
    const field = data.field ? this.fieldMapper(data.field) : null;

    return {
      id: data.id,
      moves: data.moves,
      name: data.name,
      gameEnd: data.gameEnd,
      state: data.state,
      field: field,
      user: {
        id: data.user.id,
        username: this.nameMapper(data.user),
      },
      players: this.playerMapper(data.players),
      createdAt: data.createdAt,
    };
  }

  public static gamesMapper(games: Games[]) {
    const returnArr: GameInterface[] = [];
    games.forEach((data) => {
      const field = data.field ? this.fieldMapper(data.field) : null;

      returnArr.push({
        id: data.id,
        moves: data.moves,
        name: data.name,
        gameEnd: data.gameEnd,
        field: field,
        state: data.state,
        user: {
          id: data.user.id,
          username: this.nameMapper(data.user),
        },
        players: this.playerMapper(data.players),
        createdAt: data.createdAt,
      });
    });

    return returnArr;
  }
}
