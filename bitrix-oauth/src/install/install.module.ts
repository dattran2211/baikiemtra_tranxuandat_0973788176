import { Module } from '@nestjs/common';
import { InstallController } from './install.controller';
import { OAuthService } from './oauth/oauth.service';
import { TokenService } from './token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token/token.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), HttpModule],
  controllers: [InstallController],
  providers: [OAuthService, TokenService],
})
export class InstallModule {}
