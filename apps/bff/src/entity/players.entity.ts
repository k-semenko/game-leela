import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Games } from './games.entity';
import { User } from './user.entity';

@Entity()
@Unique(['game', 'user'])
export class Players extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Games, { cascade: true, onDelete: 'CASCADE' })
  game: Games;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 1 })
  position: number;

  @Column()
  color: string;

  @Column({ default: false })
  isActive: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
