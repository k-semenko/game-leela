import { Controller, Get } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TariffsDto } from './tariffs.dto';

@ApiTags('Tariffs')
@Controller('api/tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка тарифов',
    description: 'Запрос всех доступных тарифов, отсортированных по цене',
  })
  @ApiResponse({
    type: [TariffsDto],
  })
  async getTariffs(): Promise<TariffsDto[]> {
    return await this.tariffsService.findAll();
  }
}
