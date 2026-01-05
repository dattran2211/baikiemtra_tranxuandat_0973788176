import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class JotformService {
  private readonly BASE_URL = 'https://api.jotform.com';
  private readonly logger = new Logger(JotformService.name);

  constructor(private readonly http: HttpService) {}

  async getSubmissions(formId: string) {
    this.logger.log(
      `[${new Date().toISOString()}] Bắt đầu lấy submissions từ Jotform cho formId: ${formId}`,
    );
    try {
      const res = await axios.get(
        `${this.BASE_URL}/form/${formId}/submissions`,
        {
          headers: { APIKEY: process.env.JOTFORM_API_KEY },
          params: { orderby: 'created_at', direction: 'DESC', limit: 10 },
        },
      );

      this.logger.log(
        `[${new Date().toISOString()}] Lấy thành công ${res.data.content.length} submissions từ Jotform`,
      );
      return res.data.content;
    } catch (error) {
      this.logger.error(
        `[${new Date().toISOString()}] Lỗi khi lấy submissions từ Jotform: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  mapSubmission(submission: any) {
    const answers = submission.answers;

    // Chuẩn hóa dữ liệu: xử lý đặc biệt cho từng trường
    const fullName = this.normalizeName(answers['3']?.answer) || '';
    const phone = this.normalizePhone(answers['5']?.answer) || '';
    const email = this.normalizeAnswer(answers['4']?.answer) || '';

    // console.log('--- Mapped contact ---');
    // console.log({ fullName, phone, email, submissionId: submission.id });

    return {
      fullName,
      phone,
      email,
      submissionId: submission.id,
    };
  }

  private normalizeName(answer: any): string {
    if (typeof answer === 'object' && answer !== null) {
      const { first, last } = answer;
      return [first, last].filter(Boolean).join(' ');
    } else if (Array.isArray(answer)) {
      return answer.join(' ');
    } else {
      return String(answer || '');
    }
  }

  private normalizePhone(answer: any): string {
    if (Array.isArray(answer)) {
      return answer.join(' '); // Hoặc xử lý từng phần tử nếu cần
    } else if (typeof answer === 'object' && answer !== null) {
      // Xử lý object: ưu tiên 'full', sau đó 'phone', 'value', 'text'
      return answer.full || answer.phone || answer.value || answer.text || '';
    } else {
      return String(answer || '');
    }
  }

  private normalizeAnswer(answer: any): string {
    if (Array.isArray(answer)) {
      return answer.join(' ');
    } else if (typeof answer === 'object' && answer !== null) {
      return answer.value || answer.text || JSON.stringify(answer);
    } else {
      return String(answer || '');
    }
  }
}
