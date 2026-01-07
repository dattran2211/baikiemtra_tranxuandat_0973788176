import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKeyFromHeader = request.headers['x-api-key'];
    const serverApiKey = process.env.JOTFORM_API_KEY;

    if (apiKeyFromHeader !== serverApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
