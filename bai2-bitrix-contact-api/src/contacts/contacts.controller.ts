import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiResponse } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiKeyGuard } from '../common/guards/auth.guard';
import { ContactsService } from './contacts.service';

@ApiTags('contacts')
@ApiSecurity('x-api-key') // 🔥 bắt buộc authorize trong Swagger
@UseGuards(ApiKeyGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lấy danh sách contact' })
  getAll() {
    return this.contactsService.getContacts();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Tạo contact mới' })
  async create(@Body() dto: CreateContactDto) {
    const contact = await this.contactsService.createContact(dto);
    return contact;
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Cập nhật contact theo ID' })
  update(@Param('id') id: number, @Body() dto: UpdateContactDto) {
    return this.contactsService.updateContact(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Xóa contact theo ID' })
  delete(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
