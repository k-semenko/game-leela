import { ApiProperty } from '@nestjs/swagger';

export class CellsDto {
  @ApiProperty({
    title: 'ID',
    description: 'ID клетки',
    default: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    title: 'Номер',
    description: 'Номер клетки',
    default: 1,
    type: Number,
  })
  number: number;

  @ApiProperty({
    title: 'Название',
    description: 'Название клетки',
    default: 1,
    type: String,
  })
  title: string;

  @ApiProperty({
    title: 'Описание',
    description: 'Описание клетки',
    default: 1,
    type: String,
  })
  description: string;
}
