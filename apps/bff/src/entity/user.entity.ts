import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../users/users.interface';
import { Games } from './games.entity';
import { TelegramUserRel } from './tg.entity';
import { Payments } from './payments.entity';
import { Fields } from './fields.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: null })
  firstName: string;

  @Column({ default: null })
  lastName: string;

  @Column({ default: UserRole.User })
  role: UserRole;

  @Column({ default: 5 })
  freeGames: number;

  @Column({ select: false })
  password: string;

  @Column({ unique: true, default: null })
  email: string;

  @OneToMany(() => Games, (game) => game.user)
  games: Games[];

  @OneToOne(() => TelegramUserRel, (tg) => tg.user, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  tg: TelegramUserRel;

  @OneToMany(() => Fields, (field) => field.user)
  fields: Fields[];

  @OneToMany(() => Payments, (pay) => pay.user)
  payments: Payments[];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
