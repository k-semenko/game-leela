import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/users.interface';
import { User } from './user.entity';

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'Email пользователя обращения',
    minLength: 6,
    maxLength: 124,
    required: true,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    type: UpdateUserDto,
    description: 'Пользователя системы',
  })
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ApiProperty({
    type: String,
    description: 'Тема обращения',
    required: true,
  })
  @Column()
  subject: string;

  @ApiProperty({
    type: String,
    description: 'Текст обращения',
    minLength: 10,
    maxLength: 1000,
    required: true,
  })
  @Column()
  text: string;

  @ApiProperty({
    type: Boolean,
    description: 'Активное обращение?',
    required: true,
  })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    type: String,
    description: 'Комментарий к обращению',
  })
  @Column({ default: null })
  comment: string;

  @ApiProperty({
    type: String,
    description: 'Дата создания',
  })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: string;
}
