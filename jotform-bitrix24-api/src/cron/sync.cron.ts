import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JotformService } from '../jotform/jotform.service';
import { ContactsService } from '../contacts/contacts.service';

@Injectable()
export class SyncCron {
  private readonly logger = new Logger(SyncCron.name);

  constructor(
    private readonly jotformService: JotformService,
    private readonly contactsService: ContactsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Bắt đầu công việc đồng bộ từ Jotform đến Bitrix24');
    const formId = process.env.FORM_ID!;
    const submissions = await this.jotformService.getSubmissions(formId);

    if (!submissions || submissions.length === 0) {
      this.logger.log('Không có submission mới nào');
      return;
    }

    // Lấy submission mới nhất (đầu tiên, vì đã sắp xếp DESC)
    const latestSubmission = submissions[0];
    console.log(
      'Submission từ Jotform:',
      JSON.stringify(latestSubmission, null, 2),
    );

    const contact = this.jotformService.mapSubmission(latestSubmission);
    // console.log('Dữ liệu contact chuẩn bị gửi:', contact);

    // Kiểm tra trùng
    const exists = await this.contactsService.findBySubmissionId(
      contact.submissionId,
    );
    if (exists) {
      console.log(
        `Submission đã gửi trước đó, bỏ qua: ${contact.submissionId}`,
      );
    } else {
      await this.contactsService.createContact(contact);
      console.log(
        `Contact mới đã được tạo: ${contact.fullName} (${contact.email})`,
      );
    }
  }
}
