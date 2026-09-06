import { Command, Ctx, Update } from 'nestjs-telegraf';
import { ContextSession, identifyUser } from '../core/core';
import { tgMessage, tgMessageMarkdown } from '../core/message';
import * as process from 'process';
import { DatabaseService } from './db.service';
import { PinoLogger } from 'nestjs-pino';

@Update()
export class GamesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GamesService.name);
  }

  @Command('games')
  async getGames(@Ctx() ctx: ContextSession) {
    const userId = await identifyUser(ctx, this.databaseService);
    if (!userId) {
      this.logger.warn(`User with tgId '${ctx.from.id}' not found`);
      await ctx.reply(tgMessage.startNotIdentifiedMessage(process.env.ORIGIN), {
        parse_mode: 'HTML',
      });
    } else {
      const games: any[] = await this.databaseService.getUserGames(userId);
      this.logger.debug({ userId: userId, games: games }, 'Get user games');

      if (games.length === 0) {
        await ctx.reply(tgMessageMarkdown(tgMessage.noGames), {
          parse_mode: 'MarkdownV2',
        });
      } else {
        await ctx.reply(this.getGamesMessage(games), {
          parse_mode: 'HTML',
        });
      }
    }
  }

  getGamesMessage = (games: any): string => {
    const response: string[] = [];
    games.forEach((item) => {
      response.push(
        `<a href="${process.env.ORIGIN}game/${item.id}"><b>${item.name}</b></a>` +
          `\n\n<b>Статус:</b> ${item.gameEnd ? 'Завершена' : 'Открыта'}` +
          `\n<b>Дата создания:</b> ${new Date(
            item.createdAt,
          ).toLocaleDateString()}`,
      );
    });
    return (
      '<b>Ваши игры!</b>\n\n' +
      response.join('\n<b>___________________________________</b>\n\n')
    );
  };
}
