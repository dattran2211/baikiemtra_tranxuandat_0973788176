/**
 * Điểm khởi đầu của ứng dụng NestJS
 * Thiết lập và khởi chạy server với các cấu hình toàn cục
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Hàm bootstrap khởi tạo ứng dụng
 * - Tạo instance của NestJS app từ AppModule
 * - Áp dụng global validation pipe để validate dữ liệu đầu vào
 * - Khởi động server trên port được cấu hình
 */
async function bootstrap() {
  // Tạo ứng dụng NestJS từ module chính
  const app = await NestFactory.create(AppModule);

  // Áp dụng global validation pipe
  // - whitelist: true: Loại bỏ các thuộc tính không được khai báo trong DTO
  // - forbidNonWhitelisted: true: Throw error nếu có thuộc tính không hợp lệ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Khởi động server trên port từ env hoặc mặc định 3000
  await app.listen(process.env.PORT || 3000);
}

// Gọi hàm bootstrap để khởi chạy ứng dụng
bootstrap();
