import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  // Lưu tạm các submissionId đã sync (thay bằng DB thật nếu cần)
  private syncedSubmissions: Set<string> = new Set<string>();

  /**
   * Kiểm tra submissionId đã được sync chưa
   */
  async findBySubmissionId(submissionId: string): Promise<boolean> {
    return this.syncedSubmissions.has(submissionId);
  }

  /**
   * Kiểm tra contact trùng lặp trên Bitrix24 dựa trên email hoặc phone
   * Trả về thông tin chi tiết về loại trùng lặp nếu có
   */
  async checkDuplicateContact(
    email: string,
    phone: string,
  ): Promise<{ isDuplicate: boolean; reason?: string }> {
    try {
      // Kiểm tra trùng email
      if (email) {
        const emailFilter = { EMAIL: email };
        const emailRes = await axios.post(
          `${process.env.BITRIX_WEBHOOK_URL}/crm.contact.list`,
          {
            filter: emailFilter,
            select: ['ID', 'NAME'],
          },
        );

        if (emailRes.data.result && emailRes.data.result.length > 0) {
          return {
            isDuplicate: true,
            reason: `Email "${email}" đã tồn tại trên Bitrix24 (Contact ID: ${emailRes.data.result[0].ID})`,
          };
        }
      }

      // Kiểm tra trùng phone
      if (phone) {
        const phoneFilter = { PHONE: phone };
        const phoneRes = await axios.post(
          `${process.env.BITRIX_WEBHOOK_URL}/crm.contact.list`,
          {
            filter: phoneFilter,
            select: ['ID', 'NAME'],
          },
        );

        if (phoneRes.data.result && phoneRes.data.result.length > 0) {
          return {
            isDuplicate: true,
            reason: `Số điện thoại "${phone}" đã tồn tại trên Bitrix24 (Contact ID: ${phoneRes.data.result[0].ID})`,
          };
        }
      }

      return { isDuplicate: false };
    } catch (error: any) {
      const errorMsg = `Lỗi khi kiểm tra trùng lặp contact: ${error.response?.data || error.message}`;
      this.logger.error(
        `[${new Date().toISOString()}] ${errorMsg}`,
        error.stack,
      );
      // Nếu lỗi API, giả sử không trùng để tránh bỏ qua submission
      return { isDuplicate: false };
    }
  }

  /**
   * Tạo contact trên Bitrix24 nếu chưa sync và không trùng lặp
   */
  async createContact(contact: CreateContactDto & { submissionId: string }) {
    const timestamp = new Date().toISOString();

    // Thời điểm nhận dữ liệu
    this.logger.log(
      `[${timestamp}] NHẬN DỮ LIỆU: Submission ${contact.submissionId} - Name: "${contact.fullName}", Email: "${contact.email}", Phone: "${contact.phone}"`,
    );

    const alreadySynced = await this.findBySubmissionId(contact.submissionId);
    if (alreadySynced) {
      this.logger.log(
        `[${timestamp}] TRẠNG THÁI: ĐÃ XỬ LÝ TRƯỚC ĐÓ - Submission ${contact.submissionId}`,
      );
      return;
    }

    // Kiểm tra trùng lặp trên Bitrix24
    const duplicateCheck = await this.checkDuplicateContact(
      contact.email,
      contact.phone,
    );
    if (duplicateCheck.isDuplicate) {
      this.logger.log(
        `[${timestamp}] TRẠNG THÁI: TRÙNG LẶP - ${duplicateCheck.reason}`,
      );
      // Vẫn đánh dấu đã sync để tránh sync lại
      this.syncedSubmissions.add(contact.submissionId);
      return;
    }

    try {
      const payload = {
        fields: {
          NAME: contact.fullName,
          PHONE: [{ VALUE: contact.phone, VALUE_TYPE: 'WORK' }],
          EMAIL: [{ VALUE: contact.email, VALUE_TYPE: 'WORK' }],
        },
      };

      this.logger.log(
        `[${timestamp}] TRẠNG THÁI: ĐANG GỬI ĐẾN BITRIX24 - Submission ${contact.submissionId}`,
      );

      const res = await axios.post(
        `${process.env.BITRIX_WEBHOOK_URL}/crm.contact.add`,
        payload,
      );

      this.logger.log(
        `[${timestamp}] TRẠNG THÁI: THÀNH CÔNG - Contact ID: ${res.data.result}`,
      );

      // Đánh dấu submission đã sync
      this.syncedSubmissions.add(contact.submissionId);
    } catch (error: any) {
      const errorName =
        error.response?.data?.error_description ||
        error.response?.data?.error ||
        error.code ||
        'UNKNOWN_ERROR';
      this.logger.error(`[${timestamp}] LỖI: ${errorName}`);
      throw error;
    }
  }
}
