import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tariffs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  orderDescription: string;

  @Column({ default: 0 })
  gamesCount: number;

  @Column('decimal', { scale: 2, default: 0 })
  price: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
