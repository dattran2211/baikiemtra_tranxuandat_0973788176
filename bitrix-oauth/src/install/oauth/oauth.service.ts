import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OAuthService {
  constructor(private http: HttpService) {}

  async exchangeCodeForToken(code: string, member_id: string) {
    const url = 'https://oauth.bitrix.info/oauth/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.CLIENT_ID!);
    params.append('client_secret', process.env.CLIENT_SECRET!);
    params.append('code', code);

    const response = await lastValueFrom(
      this.http.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  }
}
