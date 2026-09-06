import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CellsInterface,
  FieldInterface,
  GameInterface,
  GameStateInterface,
  PlayerInterface,
  UserProfileInterface,
} from '../interface';
import { WsService } from './ws.service';
import {
  FeedbackInterface,
  FeedbackReqInterface,
  UpdateFeedbackInterface,
} from '../components/base/help/help.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private webSocket: WsService,
  ) {}

  tgLogin = (chatId: number) => {
    return this.http.post<any>('api/auth/tg', { chatId: chatId });
  };

  tgRemove = () => {
    return this.http.delete('api/auth/tg');
  };

  userData = () => {
    return this.http.get<UserProfileInterface>('api/userData');
  };

  updateUserData = (user: UserProfileInterface | any) => {
    return this.http.patch<{ message: string }>('api/user/update', user);
  };

  profile = () => {
    return this.http.get<UserProfileInterface>('api/user/profile');
  };

  deleteProfile = () => {
    return this.http.delete('api/user/profile');
  };

  getAllGames = () => {
    return this.http.get<GameInterface[]>('api/games/all');
  };

  getFields = () => {
    return this.http.get<FieldInterface[]>('api/fields');
  };

  getGame = (gameId: number) => {
    return this.http.get<GameInterface>(`api/games/by-id/${gameId}`);
  };
  getGameByCode = (gameId: number, code: string) => {
    return this.http.get<GameInterface>(
      `api/games/by-code/${gameId}?code=${code}`,
    );
  };

  getUserGames = (userId: number) => {
    return this.http.get<GameInterface[]>(`api/games/${userId}`);
  };

  getGameCode = (gameId: string) => {
    return this.http.get(`api/games/code/${gameId}`);
  };

  createNewGame = (gameData: any) => {
    return this.http.post<GameInterface>('api/games/add', gameData);
  };

  removeGame(id: number) {
    return this.http.delete(`api/games/${id}`);
  }

  setEndGame(gameData: GameInterface) {
    return this.http
      .patch<GameInterface>(`api/games/end-game`, gameData)
      .subscribe();
  }

  updateMoves(gameData: GameInterface) {
    return this.http
      .patch<GameInterface>('api/games/update-moves', gameData)
      .subscribe();
  }

  updateGameState(gameId: number, state: GameStateInterface) {
    return this.http.patch(`api/games/set-state/${gameId}`, state).subscribe();
  }

  updatePlayerData(player: PlayerInterface) {
    return this.http
      .patch<PlayerInterface>('api/players/update-data', player)
      .subscribe();
  }

  addGamePlayer = (player: any, gameId: number) => {
    return this.http
      .post<PlayerInterface>('api/players/add', player)
      .subscribe(() => {
        location.href = `/game/${gameId}`;
      });
  };

  getCellsData() {
    return this.http.get<CellsInterface[]>('api/cells');
  }

  updateCellData(data: CellsInterface) {
    return this.http.patch<CellsInterface>('api/cells/update', data);
  }

  getAllUsers = () => {
    return this.http.get<UserProfileInterface[]>('api/users/all');
  };

  addFeedback = (data: FeedbackReqInterface) => {
    return this.http.post<{ message: string }>('api/feedback', data);
  };

  getAllFeedback = () => {
    return this.http.get<FeedbackInterface[]>('api/feedback');
  };

  updateFeedback = (data: UpdateFeedbackInterface) => {
    return this.http.patch<UpdateFeedbackInterface>('api/feedback', data);
  };

  getPaymentLink = async (data: any): Promise<string> => {
    return firstValueFrom(
      this.http.post<{ confirmationUrl: string }>('api/payment', data),
    )
      .then((value) => value.confirmationUrl)
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  changePass = (param: { oldPassword: string; password: string }) => {
    return this.http.patch('api/profile/change-pass', param);
  };
}
