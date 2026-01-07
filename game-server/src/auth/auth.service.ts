import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Đăng ký
  async register(dto: RegisterDto) {
    const exist = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (exist) throw new UnauthorizedException('Username đã tồn tại');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      username: dto.username,
      password: hash,
      email: dto.email,
      nickname: dto.nickname,
    });

    return this.usersRepo.save(user);
  }

  // Đăng nhập
  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Sai mật khẩu');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
