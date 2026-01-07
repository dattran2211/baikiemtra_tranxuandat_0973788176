import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaroGateway } from './caro.gateway';
import { CaroMatch } from './caro.entity';
import { CaroService } from './caro.service';
import { CaroController } from './caro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaroMatch])],
  providers: [CaroGateway, CaroService],
  controllers: [CaroController],
})
export class CaroModule {}
