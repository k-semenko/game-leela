import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { GameInterface, GameStateInterface } from './game.interface';
import { Games } from '../entity/games.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Games)
    private gameRepository: Repository<Games>,
  ) {}

  async findAllGames(): Promise<Games[]> {
    return await this.gameRepository.find({
      select: {
        id: true,
        name: true,
        gameEnd: true,
        createdAt: true,
        players: true,
      },
      relations: {
        user: true,
        players: { user: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getGameById(gameId: number): Promise<Games> {
    return await this.gameRepository.findOne({
      where: { id: gameId },
      select: {
        user: { id: true, username: true },
      },
      relations: {
        field: true,
        user: true,
        players: { user: true },
      },
    });
  }

  async getGameCode(gameId: number): Promise<Games> {
    return await this.gameRepository.findOne({
      where: { id: gameId },
      select: { id: true, code: true },
    });
  }

  async getAllUsersGame(userId: number): Promise<Games[]> {
    return await this.gameRepository.find({
      select: {
        id: true,
        name: true,
        gameEnd: true,
        createdAt: true,
        players: true,
      },
      where: [{ user: { id: userId } }, { players: { user: { id: userId } } }],
      order: { createdAt: 'ASC' },
      relations: {
        user: true,
        players: { user: true },
        field: true,
      },
    });
  }

  async addGame(gameData: Games): Promise<Games> {
    return await this.gameRepository.save(gameData);
  }

  async updateGameEnd(gameData: GameInterface): Promise<UpdateResult> {
    return await this.gameRepository.update(
      {
        id: gameData.id,
      },
      {
        gameEnd: gameData.gameEnd,
      },
    );
  }

  async updateGameMoves(gameData: GameInterface): Promise<UpdateResult> {
    return await this.gameRepository.update(
      {
        id: gameData.id,
      },
      {
        moves: gameData.moves,
      },
    );
  }

  async refreshGame(id: number): Promise<UpdateResult> {
    return await this.gameRepository.update(
      { id: id },
      {
        moves: [],
        gameEnd: false,
      },
    );
  }

  async removeGame(id: number) {
    return await this.gameRepository.delete(id);
  }

  /**
   * Get game state
   * @param gameId - game id
   * @param state - game state
   */
  async setGameState(gameId: number, state: GameStateInterface) {
    await this.gameRepository.update({ id: gameId }, { state: state });
  }
}
