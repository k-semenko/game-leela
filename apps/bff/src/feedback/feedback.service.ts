import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FeedbackReqDto, UpdateFeedbackReqDto } from './feedback.interface';
import { Feedback } from '../entity/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async addFeedback(data: FeedbackReqDto): Promise<Feedback> {
    const ticket: Feedback = await this.feedbackRepository.save(data);

    return this.feedbackRepository.findOne({
      where: { id: ticket.id },
      relations: { user: true },
    });
  }

  async updateFeedback(data: UpdateFeedbackReqDto): Promise<UpdateResult> {
    return await this.feedbackRepository.update(
      {
        id: data.id,
      },
      {
        comment: data.comment,
        active: data.active,
        updatedAt: () => 'CURRENT_TIMESTAMP',
      },
    );
  }
}
