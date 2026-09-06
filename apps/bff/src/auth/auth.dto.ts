import { ApiProperty } from '@nestjs/swagger';

export class ChangePassAuthDto {
  @ApiProperty({
    type: String,
    required: true,
    name: 'Токен для восстановления пароля из письма. UUID',
  })
  resetToken: string;

  @ApiProperty({ type: String, required: true, name: 'Новый пароль' })
  password: string;
}
