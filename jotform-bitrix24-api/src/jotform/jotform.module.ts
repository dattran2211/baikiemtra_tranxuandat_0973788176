import { Module } from '@nestjs/common';
import { JotformService } from './jotform.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [JotformService],
  exports: [JotformService],
})
export class JotformModule {}
