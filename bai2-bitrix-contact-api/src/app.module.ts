import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
