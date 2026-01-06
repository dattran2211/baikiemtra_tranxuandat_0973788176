import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';

import { UpdateContactDto } from '../contacts/dto/update-contact.dto';

@Injectable()
export class ContactsService {
  private webhook: string;

  constructor(private configService: ConfigService) {
    this.webhook = this.configService.get<string>('BITRIX24_WEBHOOK')!;
  }

  async getContacts() {
    try {
      const res = await axios.get(`${this.webhook}crm.contact.list`);
      return res.data.result;
    } catch (err) {
      throw new HttpException(err.response?.data || 'Error', HttpStatus.BAD_REQUEST);
    }
  }

  async createContact(dto: CreateContactDto) {
    try {
      // Tạo contact
      const contactRes = await axios.post(`${this.webhook}crm.contact.add`, {
        fields: {
          NAME: dto.name,
          ADDRESS: dto.address,
          PHONE: [{ VALUE: dto.phone, VALUE_TYPE: 'WORK' }],
          EMAIL: [{ VALUE: dto.email, VALUE_TYPE: 'WORK' }],
          WEB: [{ VALUE: dto.website, VALUE_TYPE: 'WORK' }],
        },
      });

      const contactId = contactRes.data.result;

      // Tạo bank info (requisite) nếu có
      if (dto.bank_name && dto.bank_account) {
        await axios.post(`${this.webhook}crm.requisite.add`, {
          fields: {
            ENTITY_ID: contactId,
            ENTITY_TYPE_ID: 3, // Contact
            NAME: dto.bank_name,
            PRESET_ID: 1,
            ACTIVE: 'Y',
          },
        });
      }

      return { contactId };
    } catch (err) {
      throw new HttpException(err.response?.data || 'Error', HttpStatus.BAD_REQUEST);
    }
  }

  async updateContact(id: number, dto: UpdateContactDto) {
    try {
      await axios.post(`${this.webhook}crm.contact.update`, {
        id,
        fields: {
          NAME: dto.name,
          ADDRESS: dto.address,
          PHONE: [{ VALUE: dto.phone, VALUE_TYPE: 'WORK' }],
          EMAIL: [{ VALUE: dto.email, VALUE_TYPE: 'WORK' }],
          WEB: [{ VALUE: dto.website, VALUE_TYPE: 'WORK' }],
        },
      });

      return { message: 'Updated' };
    } catch (err) {
      throw new HttpException(err.response?.data || 'Error', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteContact(id: number) {
    try {
      await axios.post(`${this.webhook}crm.contact.delete`, { id });
      return { message: 'Deleted' };
    } catch (err) {
      throw new HttpException(err.response?.data || 'Error', HttpStatus.BAD_REQUEST);
    }
  }
}
