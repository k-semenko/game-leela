import { ApiProperty } from '@nestjs/swagger';

export interface UsersInterface {
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  password: string;
  secret?: string;
}

export interface UpdateUserInterface {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
}

export enum UserRole {
  User = 'USER',
  Curator = 'CURATOR',
  Admin = 'ADMIN',
}

export class GameOwnerDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID пользователя',
    default: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    default: null,
    description: 'Имя пользователя',
  })
  username: string;
}

export class UpdateUserDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID пользователя',
    default: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    required: false,
    default: null,
    description: 'Фамилия пользователя',
  })
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
    default: null,
    description: 'Имя пользователя',
  })
  lastName?: string;

  @ApiProperty({
    type: String,
    required: false,
    default: null,
    description: 'Email пользователя',
  })
  email?: string;
}

export class UsersDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Логин пользователя',
  })
  username: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Пароль',
  })
  password: string;

  @ApiProperty({
    enum: UserRole,
    required: true,
    description: 'Роль пользователя',
  })
  role: UserRole;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Фамилия пользователя',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Имя пользователя',
  })
  lastName: string;
}
