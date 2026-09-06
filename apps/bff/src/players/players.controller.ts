import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerDto, PlayerInterface, UpdatePlayerDto } from './player.dto';
import { Players } from '../entity/players.entity';

@ApiTags('Players')
@UseGuards(JwtAuthGuard)
@Controller('api/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post('/add')
  @ApiBody({ type: PlayerDto })
  @ApiOperation({ summary: 'Добавление нового игрока в игру' })
  async addPlayer(
    @Body() playerData: Players,
    @Res() res: any,
  ): Promise<Players> {
    const errors: string[] = [];

    if (!playerData) {
      errors.push('Не заполнен объект игрока');
    }
    if (!playerData?.game) {
      errors.push('id игры не указано');
    }
    if (!playerData?.color) {
      errors.push('Цвет пользователя не указан');
    }

    if (errors.length != 0) {
      throw new BadRequestException({ statusCode: 400, message: [...errors] });
    }

    const addedPlayer = await this.playerService
      .addPlayer(playerData)
      .catch((error) => {
        throw new BadRequestException(
          error.detail.replaceAll('(', "'").replaceAll(')', "'"),
        );
      });

    return res.status(HttpStatus.OK).json(addedPlayer);
  }

  @Patch('/update-data')
  @ApiBody({ type: UpdatePlayerDto })
  @ApiOperation({ summary: 'Обновление данных игрока в БД' })
  async updatePlayerData(@Body() playerData: PlayerInterface, @Res() res: any) {
    const updatedPlayer = await this.playerService
      .updatePlayerData(playerData)
      .catch((error) => {
        throw new BadRequestException(
          error.detail?.replaceAll('(', "'").replaceAll(')', "'"),
        );
      });

    return res.status(HttpStatus.OK).json(updatedPlayer);
  }
}
