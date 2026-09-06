import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import {
  UpdateUserInterface,
  UserRole,
  UsersInterface,
} from './users.interface';
import { User } from '../entity/user.entity';
import { TelegramUserRel } from '../entity/tg.entity';
import { ResetPassEntity } from '../entity/reset-pass.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TelegramUserRel)
    private telegramUserRel: Repository<TelegramUserRel>,
    @InjectRepository(ResetPassEntity)
    protected readonly resetPass: Repository<ResetPassEntity>,
  ) {}

  async findResetPass(conditions: FindOneOptions<ResetPassEntity>) {
    return await this.resetPass.findOne(conditions);
  }

  async findOne(condition: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(condition);
  }

  async findUserByTg(tgId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { tg: { telegramId: tgId } },
    });

    return user ? user : null;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
      },
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async profileInfo(username: string): Promise<User> {
    return await this.userRepository.findOne({
      select: {
        payments: { id: true, status: true, orderId: true, createdAt: true },
      },
      where: {
        username: username.toLowerCase(),
      },
      relations: {
        payments: true,
      },
    });
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: username.toLowerCase(),
      },
      select: { id: true, username: true, password: true, role: true },
    });
  }

  async createUser(user: UsersInterface): Promise<User> {
    const userData: UsersInterface = {
      username: user.username.toLowerCase(),
      email: user.email?.toLowerCase() ?? null,
      role: user.role ?? UserRole.User,
      password: user.password,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
    };

    return await this.userRepository.save(userData);
  }

  async updateUser(user: UpdateUserInterface) {
    return await this.userRepository.update(
      {
        id: user.id,
      },
      { ...user },
    );
  }

  async fillUserTg(userId: number, tgId: number): Promise<User> {
    const user = await this.findById(userId);
    user.tg = await this.telegramUserRel.create({ telegramId: tgId }).save();
    await user.save();
    return user;
  }

  async deleteTgRel(userId: number) {
    return await this.telegramUserRel.delete({ user: { id: userId } });
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete({ id: id });
  }
}
