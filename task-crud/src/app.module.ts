import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Task],
      synchronize: true, // chỉ dev
    }),
    TaskModule,
  ],
})
export class AppModule {}
