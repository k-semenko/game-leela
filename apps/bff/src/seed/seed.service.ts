import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fields } from '../entity/fields.entity';
import { Cells } from '../entity/cells.entity';
import { Tariffs } from '../entity/tariffs.entity';
import { User } from '../entity/user.entity';
import { UserRole } from '../users/users.interface';
import { LocalStrategy } from '../auth/local.auth';

/** Idempotent demo data so `docker compose up` is playable out of the box. */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Fields)
    private readonly fieldsRepo: Repository<Fields>,
    @InjectRepository(Cells)
    private readonly cellsRepo: Repository<Cells>,
    @InjectRepository(Tariffs)
    private readonly tariffsRepo: Repository<Tariffs>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_ON_BOOT === 'false') {
      this.logger.log('SEED_ON_BOOT=false — skip demo seed');
      return;
    }

    try {
      await this.purgeRemovedDemoFields();
      await this.ensureTariffs();
      await this.ensureFields();
      await this.ensureCells();
      await this.ensureUsers();
      this.logger.log('Demo seed ready (fields/cells/tariffs/users)');
    } catch (err) {
      this.logger.error('Demo seed failed', err instanceof Error ? err.stack : err);
    }
  }


  /** Drop retired demo field rows if an old DB still has them. */
  private async purgeRemovedDemoFields() {
    const bad = await this.fieldsRepo
      .createQueryBuilder('f')
      .where("f.title = :t", { t: 'Поле 4' })
      .orWhere("f.url LIKE :u", { u: '%field4.jpg%' })
      .getMany();
    if (!bad.length) return;
    const ids = bad.map((f) => f.id);
    // games.field is ManyToOne — clear referencing games first if needed
    await this.fieldsRepo.manager.query(
      'DELETE FROM games WHERE "fieldId" = ANY($1)',
      [ids],
    );
    await this.fieldsRepo.delete(ids);
    this.logger.warn(`Purged removed demo fields: ${ids.join(',')}`);
  }

  private async ensureTariffs() {
    const demos = [
      {
        title: 'Демо: 1 игра',
        description: 'Локальный тариф для разработки',
        orderDescription: '1 game',
        gamesCount: 1,
        price: 0,
      },
      {
        title: 'Демо: 5 игр',
        description: 'Локальный пакет',
        orderDescription: '5 games',
        gamesCount: 5,
        price: 0,
      },
    ];

    for (const t of demos) {
      const exists = await this.tariffsRepo.findOne({ where: { title: t.title } });
      if (!exists) {
        await this.tariffsRepo.save(this.tariffsRepo.create(t));
      }
    }
  }

  private async ensureFields() {
    const demos = [
      {
        title: 'Поле 1',
        descriptions: 'Демо-поле из assets/game-field/field1.jpg',
        url: "url('assets/game-field/field1.jpg')",
        interface: true,
      },
      {
        title: 'Поле 2',
        descriptions: 'Демо-поле из assets/game-field/field2.jpg',
        url: "url('assets/game-field/field2.jpg')",
        interface: true,
      },
      {
        title: 'Поле 3',
        descriptions: 'Демо-поле из assets/game-field/field3.jpg',
        url: "url('assets/game-field/field3.jpg')",
        interface: true,
      },
      {
        title: 'Поле 5',
        descriptions: 'Демо-поле из assets/game-field/field5.jpg',
        url: "url('assets/game-field/field5.jpg')",
        interface: true,
      },
    ];

    for (const f of demos) {
      const exists = await this.fieldsRepo.findOne({ where: { title: f.title } });
      if (!exists) {
        await this.fieldsRepo.save(
          this.fieldsRepo.create({
            ...f,
            isActive: true,
            user: null,
          }),
        );
      } else if (exists.interface !== f.interface || exists.url !== f.url) {
        exists.interface = f.interface;
        exists.url = f.url;
        exists.descriptions = f.descriptions;
        await this.fieldsRepo.save(exists);
      }
    }
  }

  private async ensureCells() {
    const count = await this.cellsRepo.count();
    if (count >= 72) {
      return;
    }

    const existing = new Set(
      (await this.cellsRepo.find({ select: { number: true } })).map((c) => c.number),
    );

    const toCreate: Partial<Cells>[] = [];
    for (let n = 1; n <= 72; n++) {
      if (existing.has(n)) continue;
      toCreate.push({
        number: n,
        title: `Клетка ${n}`,
        description: `Демо-описание клетки ${n}`,
      });
    }

    if (toCreate.length) {
      await this.cellsRepo.save(this.cellsRepo.create(toCreate));
    }
  }

  private async ensureUsers() {
    const pass = process.env.DEMO_PASS || 'demo1234';
    const hash = await LocalStrategy.hashPass(pass);

    const accounts: Array<{
      username: string;
      role: UserRole;
      email: string;
    }> = [
      { username: 'demo', role: UserRole.User, email: 'demo@example.com' },
      { username: 'curator', role: UserRole.Curator, email: 'curator@example.com' },
      { username: 'admin', role: UserRole.Admin, email: 'admin@example.com' },
    ];

    for (const a of accounts) {
      let user = await this.userRepo.findOne({
        where: { username: a.username },
        select: {
          id: true,
          username: true,
          role: true,
          freeGames: true,
          password: true,
          email: true,
        },
      });

      if (!user) {
        user = this.userRepo.create({
          username: a.username,
          password: hash,
          role: a.role,
          email: a.email,
          freeGames: 50,
        });
        await this.userRepo.save(user);
      } else {
        user.role = a.role;
        user.freeGames = 50;
        // keep existing password if already set
        await this.userRepo.save(user);
      }
    }
  }
}
