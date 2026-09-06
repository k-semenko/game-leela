import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FieldDto } from './fields.interface';
import { Fields } from '../entity/fields.entity';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';

@ApiTags('Fields')
@UseGuards(JwtAuthGuard)
@Controller('api/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Get()
  @ApiResponse({ type: [FieldDto] })
  @ApiOperation({ summary: 'Получение данных по игровым полям' })
  async getAll(@Req() req: any, @Res() res: any): Promise<Fields[]> {
    const fields = await this.fieldsService.getAllFields({
      where: { isActive: true },
      relations: {
        user: true,
      },
    });

    if (fields) {
      const finalFieldsList = fields.filter((f) => {
        return f.user === null || f.user?.id === req.user?.id;
      });

      return res.status(200).json(finalFieldsList);
    }

    return res.status(400).json({
      error: 400,
      message: 'Непредвиденная ошибка при получении данных игровых полей',
    });
  }
}
