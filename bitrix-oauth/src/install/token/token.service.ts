import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
    private http: HttpService,
  ) {}

  /**
   * Lưu token vào SQLite
   */
  async saveToken(data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    member_id: string;
    created_at: number;
  }) {
    let token = await this.tokenRepo.findOne({ where: { member_id: data.member_id } });

    if (!token) {
      token = this.tokenRepo.create();
    }

    token.access_token = data.access_token;
    token.refresh_token = data.refresh_token;
    token.expires_in = data.expires_in;
    token.member_id = data.member_id;
    token.created_at = data.created_at;

    await this.tokenRepo.save(token);
    console.log('Token saved in SQLite:', token);
  }

  /**
   * Load token từ SQLite
   */
  async loadToken(member_id: string): Promise<Token | null> {
    return await this.tokenRepo.findOne({ where: { member_id } });
  }

  /**
   * Lấy token hợp lệ, tự động refresh nếu hết hạn
   */
  async getValidToken(member_id: string): Promise<Token> {
    const token = await this.loadToken(member_id);
    if (!token) throw new Error('No token found for this member_id');

    const now = Date.now();
    const tokenExpireTime = token.created_at + token.expires_in * 1000;

    // Nếu token sắp hết hạn (trước 1 phút), refresh
    if (now > tokenExpireTime - 60000) {
      return await this.refreshToken(member_id);
    }

    return token;
  }

  /**
   * Refresh token bằng refresh_token
   */
  async refreshToken(member_id: string): Promise<Token> {
    const token = await this.loadToken(member_id);
    if (!token) {
      throw new Error('Cannot refresh token: token not found');
    }

    const url = 'https://oauth.bitrix.info/oauth/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', process.env.CLIENT_ID!);
    params.append('client_secret', process.env.CLIENT_SECRET!);
    params.append('refresh_token', token.refresh_token);

    try {
      const response = await lastValueFrom(
        this.http.post(url, params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      const newTokenData = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        member_id,
        created_at: Date.now(),
      };

      // Lưu token mới vào SQLite
      await this.saveToken(newTokenData);

      // Load lại token chắc chắn không null
      const refreshedToken = await this.loadToken(member_id);
      if (!refreshedToken) {
        throw new Error('Token still not found after refresh!');
      }

      console.log('Token refreshed:', refreshedToken);
      return refreshedToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw new Error('Failed to refresh token');
    }
  }
}
