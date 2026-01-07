import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OAuthService } from './oauth/oauth.service';
import { TokenService } from './token/token.service';
import axios from 'axios';

@Controller('install')
export class InstallController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly tokenService: TokenService
  ) {}

  // Nhận POST từ Bitrix24
  @Post()
  async install(@Body() body: any) {
    console.log('INSTALL POST BODY:', body);

    const { code, member_id, AUTH_ID, REFRESH_ID, AUTH_EXPIRES } = body;

    // Nếu Bitrix gửi token trực tiếp
    if (AUTH_ID) {
      await this.tokenService.saveToken({
        access_token: AUTH_ID,
        refresh_token: REFRESH_ID,
        expires_in: parseInt(AUTH_EXPIRES),
        member_id,
        created_at: Date.now(),
      });
      return { success: true };
    }

    // Nếu code OAuth
    if (code) {
      const tokenData = await this.oauthService.exchangeCodeForToken(code, member_id);
      await this.tokenService.saveToken({ ...tokenData, member_id, created_at: Date.now() });
      return { success: true, token: tokenData };
    }

    return { success: false, message: 'Missing code or token' };
  }

  // Test gọi API crm.contact.list
  @Get('contacts')
  async getContacts(@Query('member_id') member_id: string) {
    const token = await this.tokenService.getValidToken(member_id);

    const url = `https://b24-2u4fjh.bitrix24.vn/rest/crm.contact.list.json?auth=${token.access_token}`;
    const response = await axios.get(url);
    return response.data;
  }
}
