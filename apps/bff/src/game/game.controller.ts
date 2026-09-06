import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import {
  CreateGameDto,
  GameEndDto,
  GameInterface,
  GamesDto,
  GameStateInterface,
} from './game.interface';
import { Role, Roles } from '../roles/roles.decorator';
import { GamesMapper } from '../mappers/games.mapper';
import { PlayersService } from '../players/players.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { Games } from '../entity/games.entity';
import { PinoLogger } from 'nestjs-pino';
import { Exception } from 'handlebars';
import { Players } from '../entity/players.entity';
import * as process from 'process';
import { TelegramService } from '../telegram/telegram.service';

@ApiTags('Games')
@UseGuards(JwtAuthGuard)
@Controller('api/games')
export class GameController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly gameService: GameService,
    private readonly playerService: PlayersService,
    private readonly userService: UsersService,
    private readonly telegramService: TelegramService,
  ) {
    this.logger.setContext(GameController.name);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Получение всех игр' })
  @ApiResponse({ type: [GamesDto] })
  async getAll(@Res() res: any): Promise<GameInterface[]> {
    const games = await this.gameService
      .findAllGames()
      .then((data) => {
        this.logger.debug(data, 'GetAllGames. Получение всех игр');
        return data;
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Exception(err);
      });

    if (games.length === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(GamesMapper.gamesMapper(games));
    }
  }

  @Get('/:userId')
  @ApiResponse({ type: [GamesDto] })
  @ApiOperation({
    summary: 'Получение игр пользователя',
    description: 'Получение игр пользователя и тех, в которых он участвовал',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    required: true,
    example: 1,
  })
  async getMyGames(@Param('userId') userId: number, @Res() res: any) {
    if (!userId || String(userId) === '') {
      this.logger.error('GetMyGames. Не верный id пользователя');
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: '400',
        message: 'Не верный id пользователя!',
      });
    }

    const games: Games[] = await this.gameService
      .getAllUsersGame(userId)
      .then((data) => {
        this.logger.debug(data, 'GetMyGames. Получение игр пользователя');
        return data;
      })
      .catch((error) => {
        this.logger.error(error, 'GetMyGames. Получение игр пользователя');
        throw new BadRequestException(
          error.detail?.replaceAll('(', "'").replaceAll(')', "'"),
        );
      });

    return res.status(HttpStatus.OK).json(GamesMapper.gamesMapper(games));
  }

  @Get('/code/:id')
  @ApiOperation({ summary: 'Получение кода доступа к игре' })
  @ApiParam({
    name: 'id',
    description: 'ID игры',
    required: true,
    example: 95,
  })
  async getGameCode(@Param('id') id: number, @Res() res: any) {
    const game: Games = await this.gameService
      .getGameCode(id)
      .then((data) => {
        this.logger.debug(data, 'GetGameCode. Получение кода доступа к игре');
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'GetGameCode. Получение кода доступа к игре');
        throw new BadRequestException(
          err.detail?.replaceAll('(', "'").replaceAll(')', "'") ?? err.hint,
        );
      });

    if (!game) {
      this.logger.warn(`Игра '${id}' не найдена`);
      throw new NotFoundException(`Игра '${id}' не найдена`);
    }

    return res.status(200).json({ code: game.code });
  }

  @Get('/by-code/:id')
  @ApiOperation({ summary: 'Получение игры по коду доступа' })
  @ApiParam({
    name: 'id',
    description: 'ID игры',
    required: true,
    example: 95,
  })
  @ApiParam({
    name: 'code',
    description: 'Код доступа к игре',
    required: true,
    example: 'f234Dds',
  })
  async getGameByCode(
    @Param('id') id: number,
    @Query('code') code: string,
    @Res() res: any,
  ) {
    const game: Games = await this.gameService
      .getGameById(id)
      .then((data: Games) => {
        this.logger.debug(
          data,
          'GetGameByCode. Получение игры по коду доступа',
        );
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'GetGameByCode. Получение игры по коду доступа');
        throw new BadRequestException(
          err.detail?.replaceAll('(', "'").replaceAll(')', "'") ?? err.hint,
        );
      });

    if (!game) {
      this.logger.warn(`GetGameByCode. Игра '${id}' не найдена`);
      throw new NotFoundException(`Игра '${id}' не найдена`);
    }

    if (code !== game.code) {
      this.logger.warn(
        game,
        `GetGameByCode. Код доступа к игре '${game.id}' не корректен`,
      );
      throw new BadRequestException('Код доступа к игре не корректен');
    }

    return res.status(200).json(GamesMapper.gameMapper(game));
  }

  @Get('/by-id/:id')
  @ApiOperation({ summary: 'Получение игры по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID игры',
    required: true,
    example: 95,
  })
  async getGameById(@Param('id') id: number, @Res() res: any) {
    const game: Games = await this.gameService
      .getGameById(id)
      .then((data) => {
        this.logger.debug(data, 'GetGameById. Получение игры по ID');
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'GetGameById. Получение игры по ID');
        throw new BadRequestException(
          err.detail?.replaceAll('(', "'").replaceAll(')', "'") ?? err.hint,
        );
      });

    if (!game) {
      this.logger.warn(`Игра '${id}' не найдена`);
      throw new NotFoundException(`Игра '${id}' не найдена`);
    }

    return res.status(200).json(GamesMapper.gameMapper(game));
  }

  @Post('/add')
  @Roles(Role.ADMIN, Role.CURATOR)
  @ApiOperation({ summary: 'Добавление новой игры' })
  async addGame(
    @Body() gameData: CreateGameDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = await this.userService.findById(req.user.id);
    if (user.freeGames !== 0) {
      const addedGame = await this.gameService
        .addGame(gameData.game)
        .then((data) => {
          this.logger.debug(data, 'AddGame. Добавление новой игры');

          if (gameData.alsoPlay) {
            const player: Players = new Players();
            player.user = user;
            player.game = data;
            player.color = '#3682db';
            player.save();
          }

          return data;
        })
        .catch((error) => {
          this.logger.error(error, 'AddGame. Добавление новой игры');
          throw new BadRequestException(
            error.detail.replaceAll('(', "'").replaceAll(')', "'"),
          );
        });

      user.freeGames = user.freeGames - 1;
      await user.save();

      await this.telegramService
        .sendMessageToGroup(
          `*Добавлена новая игра!*\n${process.env.ORIGIN}` +
            `\n\nЛогин: *${user.username}*`,
        )
        .catch((err) => {
          this.logger.error(
            err,
            'AddGame. Ошибка отправки сообщения в телеграм',
          );
        });

      return res.status(HttpStatus.OK).json(addedGame);
    } else {
      this.logger.warn(user.id, 'AddGame. Исчерпано количество бесплатных игр');
      throw new BadRequestException(
        'Исчерпано количество бесплатных игр. Необходимо приобрести дополнительные игры',
      );
    }
  }

  @Patch('/end-game')
  @ApiOperation({
    summary: 'Завершение игры',
    description: 'Выставляется флаг gameEnd = true',
  })
  @ApiBody({ type: GameEndDto })
  @ApiOkResponse({ description: 'Игра завершена' })
  async updateGameEnd(@Body() gameData: GameInterface, @Res() res: any) {
    const updateResponse = await this.gameService.updateGameEnd(gameData);

    if (updateResponse.affected === 0) {
      this.logger.warn(
        gameData,
        'UpdateGameEnd. Не удалось обновить игру или игра не найдена',
      );
      return res
        .status(400)
        .json({ message: 'Не удалось обновить игру или игра не найдена' });
    } else {
      this.logger.debug(`UpdateGameEnd. Игра '${gameData.id}' завершена`);
      return res.status(200).json({ message: 'Игра завершена' });
    }
  }

  @Patch('/update-moves')
  @ApiOperation({ summary: 'Обновление ходов игры' })
  async updateGameMoves(@Body() gameData: GameInterface, @Res() res: any) {
    this.logger.debug(gameData, 'UpdateGameMoves. Обновление ходов игры');

    await this.gameService.updateGameMoves(gameData);
    return res.status(200).json({});
  }

  @Patch('/refresh/:id')
  @ApiOperation({ summary: 'Полный сброс прогресса игры' })
  @ApiParam({
    name: 'id',
    description: 'ID игры',
    required: true,
    example: 95,
  })
  @Roles(Role.ADMIN)
  async refresh(@Param('id') id: number, @Res() res: any) {
    try {
      await this.gameService.refreshGame(id);
      await this.playerService.refreshPlayers(id);

      this.logger.debug(`RefreshGame. Полный сброс прогресса игры '${id}'`);
      return res.status(200).json({
        status: 200,
        message: 'Данные игры очищены!',
      });
    } catch (e) {
      this.logger.error(e, `RefreshGame. Полный сброс прогресса игры '${id}'`);
      return res.status(500).json(e);
    }
  }

  @Patch('/set-state/:id')
  @ApiOperation({ summary: 'Обновление состояния игры' })
  async setGameState(
    @Param('id') id: number,
    @Body() state: GameStateInterface,
    @Res() res: any,
  ) {
    this.logger.debug(state, 'SetGameState. Обновление состояния игры');
    try {
      await this.gameService.setGameState(id, state);
      return res.status(200).json({
        status: 200,
        message: 'Состояние игры обновлено!',
      });
    } catch (e) {
      this.logger.error(e, `SetGameState. Обновление состояния игры '${id}'`);
      return res.status(500).json(e);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление игры' })
  @ApiParam({
    name: 'id',
    description: 'ID игры',
    required: true,
    example: 95,
  })
  async removeGame(
    @Param('id') id: number,
    @Request() req: any,
    @Res() res: any,
  ) {
    const game = await this.gameService
      .getGameById(id)
      .then((data) => {
        this.logger.debug(data, 'RemoveGame. Удаление игры');
        return data;
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Exception(err);
      });

    const isAdmin = req.user.role === Role.ADMIN;

    if (!isAdmin || (!isAdmin && game.user.id !== req.user.id)) {
      throw new ForbiddenException('Нельзя удалить чужую игру!');
    }

    await this.gameService.removeGame(id).catch((err) => {
      throw new BadRequestException(
        err.detail?.replaceAll('(', "'").replaceAll(')', "'"),
      );
    });

    return res.status(200).json({ message: 'Игра удалена' });
  }
}
