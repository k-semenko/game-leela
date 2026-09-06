import { UsersDTO } from '../users/users.interface';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackReqDto {
  @ApiProperty({
    type: String,
    description: 'Email пользователя обращения',
    minLength: 6,
    maxLength: 124,
    required: true,
  })
  email: string;

  @ApiProperty({
    type: Number,
    description: 'ID пользователя системы',
    required: false,
  })
  user: UsersDTO;

  @ApiProperty({
    type: String,
    description: 'Тема обращения',
    required: true,
  })
  subject: string;

  @ApiProperty({
    type: String,
    description: 'Текст обращения',
    minLength: 10,
    maxLength: 1000,
    required: true,
  })
  text: string;
}

export class UpdateFeedbackReqDto {
  @ApiProperty({
    type: Number,
    description: 'ID обращения',
    required: true,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Комментарий к обращению',
  })
  comment: string;

  @ApiProperty({
    type: Boolean,
    description: 'Активное обращение?',
    required: true,
  })
  active: boolean;
}
