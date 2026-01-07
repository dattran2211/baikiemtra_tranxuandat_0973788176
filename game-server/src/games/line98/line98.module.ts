import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line98Service } from './line98.service';
import { Line98Controller } from './line98.controller';
import { Line98Gateway } from './line98.gateway';
import { Line98Game } from './line98.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Line98Game])],
  providers: [Line98Service, Line98Gateway],
  controllers: [Line98Controller]
})
export class Line98Module {}
