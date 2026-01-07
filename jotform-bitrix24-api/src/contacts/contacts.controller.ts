import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ApiKeyGuard } from './api-key.guard';
import { JotformService } from '../jotform/jotform.service';

@Controller('contacts/webhook')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(
    private readonly contactsService: ContactsService,
    private readonly jotformService: JotformService,
  ) {}

  @UseGuards(ApiKeyGuard)
  @Post('jotform')
  async receiveJotformData() {
    this.logger.log(`[${new Date().toISOString()}] Nhận webhook từ Jotform`);

    const formId = process.env.FORM_ID;
    if (!formId) {
      this.logger.error(
        `[${new Date().toISOString()}] FORM_ID không được định nghĩa trong .env`,
      );
      throw new Error('FORM_ID is not defined in .env');
    }

    try {
      const submissions = await this.jotformService.getSubmissions(formId);
      this.logger.log(
        `[${new Date().toISOString()}] Lấy được ${submissions.length} submission từ Jotform`,
      );

      for (const sub of submissions) {
        this.logger.log(
          `[${new Date().toISOString()}] Xử lý submission ID: ${sub.id}`,
        );
        const contact = this.jotformService.mapSubmission(sub);
        this.logger.log(
          `[${new Date().toISOString()}] Mapped contact: ${JSON.stringify(contact)}`,
        );
        await this.contactsService.createContact(contact);
      }

      this.logger.log(`[${new Date().toISOString()}] Xử lý webhook thành công`);
      return { message: 'Success' };
    } catch (error: any) {
      this.logger.error(
        `[${new Date().toISOString()}] Lỗi khi xử lý webhook: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
