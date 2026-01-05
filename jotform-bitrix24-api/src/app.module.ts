import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';
import { JotformModule } from './jotform/jotform.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncCron } from './cron/sync.cron';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- quan trọng
    ContactsModule,
    JotformModule,
    ScheduleModule.forRoot(),
  ],
  providers: [SyncCron],
})
export class AppModule {}
