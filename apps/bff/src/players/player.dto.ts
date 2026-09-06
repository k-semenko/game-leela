import { ApiProperty } from '@nestjs/swagger';
export interface PlayerInterface {
  id: number;
  username: string;
  color: string;
  position: number;
  isActive: boolean;
  userId: number;
}
export class PlayerDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID игры',
  })
  game: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'ID пользователь',
  })
  user: number;

  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
    description: 'Позиция игрока',
  })
  position: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
    description: 'Активен ли игрок',
  })
  isActive: boolean;
}

export class UpdatePlayerDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID игрока в БД',
  })
  id: number;

  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
    description: 'Позиция игрока',
  })
  position: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
    description: 'Активен ли игрок',
  })
  isActive: boolean;
}

export class PlayerMapperDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID игрока',
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Имя игрока',
  })
  username: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Цвет игрока',
  })
  color: number;

  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
    description: 'Позиция игрока',
  })
  position: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
    description: 'Активен ли игрок',
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'ID пользователь',
  })
  userId: number;
}
