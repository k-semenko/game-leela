import { Ctx, Hears, Help, On, Settings, Start, Update } from 'nestjs-telegraf';
import { tgMessage, tgMessageMarkdown } from '../core/message';
import * as process from 'process';
import { ContextSession } from '../core/core';
import { DatabaseService } from './db.service';

@Update()
export class CommandsService {
  constructor(private readonly databaseService: DatabaseService) {}

  @Start()
  async start(@Ctx() ctx: ContextSession) {
    const host = process.env.ORIGIN;

    const userId: number = await this.databaseService.getUserIdByTg(
      ctx.from.id,
    );

    if (userId) {
      await ctx.reply(tgMessage.startIdentifiedMessage, {
        parse_mode: 'MarkdownV2',
      });
    } else {
      await ctx.reply(tgMessage.startNotIdentifiedMessage(host), {
        parse_mode: 'HTML',
      });
    }
  }

  @Help()
  async help(@Ctx() ctx: ContextSession) {
    await this.settings(ctx);

    const commands = await ctx.telegram.getMyCommands();
    const info = commands.reduce(
      (acc, val) => `${acc}/${val.command} - ${val.description}\n\n`,
      '',
    );
    await ctx.reply(tgMessageMarkdown(tgMessage.helpMessage + info), {
      parse_mode: 'MarkdownV2',
    });
  }

  @Settings()
  async settings(@Ctx() ctx: ContextSession) {
    return await ctx.telegram.setMyCommands([
      {
        command: '/start',
        description: 'Запуск бота',
      },
      {
        command: '/games',
        description: 'Мои игры',
      },
      {
        command: '/help',
        description: 'Помощь',
      },
    ]);
  }

  @On('sticker')
  async on(@Ctx() ctx: ContextSession) {
    await ctx.reply('Классный стикер! 👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx: ContextSession) {
    await ctx.reply('Hey there');
  }
}
