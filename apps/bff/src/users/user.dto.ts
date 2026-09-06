import { ApiProperty } from '@nestjs/swagger';

export class ChangePassDto {
  @ApiProperty({ type: String, name: 'oldPassword', required: true })
  oldPassword: string;

  @ApiProperty({ type: String, name: 'password', required: true })
  password: string;
}
