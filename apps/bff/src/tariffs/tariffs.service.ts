import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tariffs } from '../entity/tariffs.entity';
import { TariffsDto } from './tariffs.dto';

@Injectable()
export class TariffsService {
  constructor(
    @InjectRepository(Tariffs)
    private readonly tariffsRepo: Repository<Tariffs>,
  ) {}

  findAll = async (): Promise<TariffsDto[]> => {
    return await this.tariffsRepo.find({
      order: { price: 'ASC' },
    });
  };

  findTariffById = async (tariffId: number): Promise<TariffsDto> => {
    return await this.tariffsRepo.findOneBy({ id: tariffId });
  };
}
