import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Cells } from '../entity/cells.entity';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cells)
    private cellsRepository: Repository<Cells>,
  ) {}

  async getAllCells(): Promise<Cells[]> {
    return await this.cellsRepository.find({
      order: { number: 'ASC' },
    });
  }

  async update(cell: Cells): Promise<UpdateResult> {
    return await this.cellsRepository.update(
      { id: cell.id },
      {
        number: cell.number,
        title: cell.title,
        description: cell.description,
      },
    );
  }
}
