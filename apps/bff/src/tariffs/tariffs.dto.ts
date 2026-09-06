import { ApiProperty } from '@nestjs/swagger';

export class TariffsDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  orderDescription: string;

  @ApiProperty({ type: Number })
  gamesCount: number;

  @ApiProperty({ type: Number })
  price: number;
}
