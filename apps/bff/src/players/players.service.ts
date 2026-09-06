import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PlayerInterface } from './player.dto';
import { Players } from '../entity/players.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Players)
    private playersRepository: Repository<Players>,
  ) {}

  async addPlayer(player: Players): Promise<Players> {
    return await this.playersRepository.save(player);
  }

  async updatePlayerData(playerData: PlayerInterface): Promise<UpdateResult> {
    return await this.playersRepository.update(
      { id: playerData.id },
      {
        position: playerData.position,
        isActive: playerData.isActive,
      },
    );
  }

  async refreshPlayers(id: number): Promise<UpdateResult> {
    return await this.playersRepository.update(
      {
        game: { id: id },
      },
      {
        position: 1,
        isActive: false,
      },
    );
  }
}
