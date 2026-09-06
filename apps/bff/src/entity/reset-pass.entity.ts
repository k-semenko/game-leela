import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reset-password' })
export class ResetPassEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  resetToken: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
