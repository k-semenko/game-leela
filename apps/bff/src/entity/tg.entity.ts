import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TelegramUserRel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (u) => u.tg)
  @JoinColumn()
  user: User;

  @Column('bigint', { unique: true })
  telegramId: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
