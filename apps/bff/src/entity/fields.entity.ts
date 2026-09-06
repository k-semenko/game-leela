import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Fields extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: null })
  descriptions: string;

  @Column()
  url: string;

  @Column({
    comment: 'Отображать интерфейс поля? Номер ячейки, название клетки.',
  })
  interface: boolean;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @Column({ default: true })
  isActive: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
