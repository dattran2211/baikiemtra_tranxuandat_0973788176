import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Tên contact' })
  @IsNotEmpty({ message: 'Tên contact là bắt buộc' })
  @IsString({ message: 'Tên contact phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Tên contact phải có ít nhất 1 ký tự' })
  @MaxLength(100, { message: 'Tên contact không được vượt quá 100 ký tự' })
  name: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ không được vượt quá 255 ký tự' })
  address?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ (định dạng Việt Nam)' })
  @MaxLength(15, { message: 'Số điện thoại không được vượt quá 15 ký tự' })
  phone?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email?: string;

  @ApiProperty({ description: 'Website', required: false })
  @IsOptional()
  @IsString({ message: 'Website phải là chuỗi ký tự' })
  @IsUrl({}, { message: 'Website phải là URL hợp lệ' })
  @MaxLength(200, { message: 'Website không được vượt quá 200 ký tự' })
  website?: string;

  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  @IsOptional()
  @IsString({ message: 'Tên ngân hàng phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Tên ngân hàng phải có ít nhất 1 ký tự' })
  @MaxLength(100, { message: 'Tên ngân hàng không được vượt quá 100 ký tự' })
  bank_name?: string;

  @ApiProperty({ description: 'Số tài khoản', required: false })
  @IsOptional()
  @IsString({ message: 'Số tài khoản phải là chuỗi ký tự' })
  @MinLength(8, { message: 'Số tài khoản phải có ít nhất 8 ký tự' })
  @MaxLength(20, { message: 'Số tài khoản không được vượt quá 20 ký tự' })
  bank_account?: string;
}
