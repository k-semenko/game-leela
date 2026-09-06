import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Payments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  paymentId: string;

  @Column({ default: null })
  orderId: string;

  @Column({ default: null })
  confirmationUrl: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  paid: boolean;

  @Column('decimal', { scale: 2, default: 0 })
  incomeAmount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
