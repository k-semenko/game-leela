import { DataSource } from 'typeorm';
import * as process from 'process';

export class DatabaseService {
  dataSource: DataSource = null;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      schema: 'public',
    });

    this.dataSource.initialize();
  }

  getUserIdByTg = async (tgId: number): Promise<number> => {
    const relations = await this.dataSource.manager.query(
      `select "userId" from public.telegram_user_rel where "telegramId" = $1 limit 1;`,
      [tgId],
    );

    return relations[0] ? relations[0].userId : null;
  };

  async getUserGames(userId: number) {
    return await this.dataSource.manager.query(
      'select g.id , g."name", g."createdAt", g."userId" \n' +
        'from games g \n' +
        'left join players p on p."gameId" = g.id  \n' +
        'where g."userId" = $1 or p."userId" = $2\n' +
        'group by g.id',
      [userId, userId],
    );
  }
}
