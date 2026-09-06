import { Body, Controller, Get, Patch, Res, UseGuards } from '@nestjs/common';
import { CellsService } from './cells.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { CellsDto } from './cells.dto';
import { Cells } from '../entity/cells.entity';

@ApiTags('Cells')
@Controller('api/cells')
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение описаний и названий клеток' })
  async getAll(@Res() res: any): Promise<Cells[]> {
    const cells = await this.cellsService.getAllCells();

    if (cells) {
      return res.status(200).json(cells);
    }

    return res.status(400).json({
      error: 400,
      message: 'Непредвиденная ошибка при получении данных ячеек',
    });
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CellsDto })
  @ApiOperation({ summary: 'Обновление данных по клеткам' })
  async updateCell(@Res() res: any, @Body() cellData: Cells): Promise<Cells> {
    const cell = await this.cellsService.update(cellData);

    if (cell) {
      return res.status(200).json({});
    }

    return res.status(400).json({
      error: 400,
      message: 'Непредвиденная ошибка при обновлении данных ячеек',
    });
  }
}
