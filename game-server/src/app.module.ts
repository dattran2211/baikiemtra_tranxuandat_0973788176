import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Line98Module } from './games/line98/line98.module';
import { CaroModule } from './games/caro/caro.module';
import { User } from './users/user.entity';
import { Line98Game } from './games/line98/line98.entity';
import { CaroMatch } from './games/caro/caro.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Line98Game, CaroMatch],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    Line98Module,
    CaroModule,
  ],
})
export class AppModule {}
