import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fields } from './fields.entity';
import { GameStateInterface, MovesInterface } from '../game/game.interface';
import { User } from './user.entity';
import { Players } from './players.entity';

@Entity()
export class Games extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Fields)
  field: Fields;

  @Column()
  code: string;

  @Column('jsonb', { default: null })
  state: GameStateInterface;

  @Column('jsonb', { default: [] })
  moves: MovesInterface[];

  @Column({ default: false })
  gameEnd: boolean;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Players, (pl) => pl.game)
  players: Players[];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
