import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app)); // ⚠️ quan trọng
  app.enableCors({ origin: '*' });

  // Serve folder public
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000);
  console.log('Server running at http://localhost:3000');
}
bootstrap();
