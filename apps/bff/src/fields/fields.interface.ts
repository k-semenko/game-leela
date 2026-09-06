import { ApiProperty } from '@nestjs/swagger';

export interface FieldInterface {
  id: number;
  title: string;
  description: string;
  url: string;
  interface: boolean;
}

export class FieldDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({
    deprecated: true,
    description: 'Скорее всего выпилим скоро',
  })
  description: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Boolean })
  interface: boolean;

  @ApiProperty({ type: Number })
  user: number;
}
