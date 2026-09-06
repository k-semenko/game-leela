import { type Context } from 'telegraf';
import type { Update } from 'telegraf/types';
import * as process from 'process';
import { DatabaseService } from '../services/db.service';
import * as momentTimezone from 'moment-timezone';
import * as moment from 'moment';
import * as uuid from 'uuid';
import { Params } from 'nestjs-pino';

export interface ContextSession<U extends Update = Update> extends Context<U> {
  session: {
    userId: number;
  };
}

export const identifyUser = async (
  ctx: ContextSession,
  databaseService: DatabaseService,
): Promise<number | null> => {
  if (!ctx.session.userId) {
    const userId: number = await databaseService.getUserIdByTg(ctx.from.id);

    if (!userId) {
      return null;
    } else {
      ctx.session.userId = userId;
      return ctx.session.userId;
    }
  } else {
    return ctx.session.userId;
  }
};

export const AppLoggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: () => {
      return `, "time": "${momentTimezone
        .tz(moment(), 'Europe/Moscow')
        .format(moment.defaultFormat)}"`;
    },
    formatters: {
      level(label, number) {
        return { level: label };
      },
    },
    transport: {
      target: 'pino/file',
      options: { destination: `logs/system.log` },
    },
    genReqId: (req, res) => {
      const requestIp =
        req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
      return requestIp ?? uuid.v4();
    },
    messageKey: 'message',
    errorKey: 'error',
    nestedKey: 'payload',
  },
};
