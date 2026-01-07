
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // <-- đây là provider đúng
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async create(username: string, password: string) {
    const user = this.userRepository.create({ username, password });
    return this.userRepository.save(user);
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }
}
