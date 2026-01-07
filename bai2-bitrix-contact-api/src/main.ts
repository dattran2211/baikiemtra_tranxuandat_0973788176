import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Thêm ValidationPipe để kích hoạt class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ các trường không được khai báo trong DTO
    forbidNonWhitelisted: true, // Báo lỗi nếu có trường không được khai báo
    transform: true, // Tự động transform dữ liệu theo kiểu khai báo
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Bitrix24 Contact API')
    .setDescription('API quản lý Contact trên Bitrix24')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'x-api-key', // scheme name trùng @ApiSecurity
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
