import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // <-- quan trọng: tạo provider Repository<User>
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // nếu dùng UsersService ngoài module
})
export class UsersModule {}
