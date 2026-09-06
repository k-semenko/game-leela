import 'reflect-metadata';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';
import { Games } from './entity/games.entity';
import { Players } from './entity/players.entity';
import { Cells } from './entity/cells.entity';
import { Fields } from './entity/fields.entity';
import { Feedback } from './entity/feedback.entity';
import { TelegramUserRel } from './entity/tg.entity';
import { Tariffs } from './entity/tariffs.entity';
import { Payments } from './entity/payments.entity';
import { User } from './entity/user.entity';
import { ResetPassEntity } from './entity/reset-pass.entity';

export const AppDataSource: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  autoLoadEntities: true,
  entities: [
    User,
    Games,
    Players,
    Cells,
    Fields,
    Feedback,
    TelegramUserRel,
    Tariffs,
    Payments,
    ResetPassEntity,
  ],
};
