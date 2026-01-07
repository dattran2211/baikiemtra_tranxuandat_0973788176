import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { JotformService } from '../jotform/jotform.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ContactsController],
  providers: [ContactsService, JotformService],
  exports: [ContactsService],
})
export class ContactsModule {}
