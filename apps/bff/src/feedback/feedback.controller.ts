import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { FeedbackReqDto, UpdateFeedbackReqDto } from './feedback.interface';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { Role, Roles } from '../roles/roles.decorator';
import { Feedback } from '../entity/feedback.entity';

@ApiTags('Help')
@Controller('api/feedback')
export class FeedbackController {
  constructor(
    private readonly helpService: FeedbackService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех тикетов' })
  @ApiResponse({ type: [Feedback] })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async getTickets(@Res() res: any) {
    const feedbacks = await this.helpService.findAll();

    return res.status(200).json(feedbacks);
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового тикета' })
  @ApiBody({ type: FeedbackReqDto })
  async addNewTicket(@Body() data: FeedbackReqDto, @Res() res: any) {
    const ticket = await this.helpService.addFeedback(data);

    if (ticket) {
      await this.mailService.sendTicket(ticket);
      return res.status(200).json({ message: 'Обращение успешно создано' });
    }

    return res
      .status(400)
      .json({ message: 'Не удалось создать обращение, попробуйте позднее' });
  }

  @Patch()
  @ApiOperation({ summary: 'Обновление тикетов' })
  @ApiBody({ type: UpdateFeedbackReqDto })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async updateTicket(@Body() data: UpdateFeedbackReqDto, @Res() res: any) {
    const update = await this.helpService.updateFeedback(data);
    if (update.affected == 1) {
      return res.status(200).json({ message: 'Тиккет успешно обновлен' });
    }

    return res.status(400).json({ message: 'Не удалось обновить обращение' });
  }
}
