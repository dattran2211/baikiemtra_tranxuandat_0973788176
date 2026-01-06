import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { InstallModule } from './install/install.module';
import { Token } from './install/token/token.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/bitrix-token.sqlite',
      entities: [Token],
      synchronize: true, // tự tạo table
    }),
    InstallModule,
  ],
})
export class AppModule {}
