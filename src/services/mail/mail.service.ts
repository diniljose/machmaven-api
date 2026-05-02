import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO, MAIL_FROM_NAME } from 'src/constants';


@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendSupportMail(dto: any, clientIp?: string) {
    if (!MAIL_TO) {
      throw new Error('Missing MAIL_TO in environment');
    }

    const subject = `[${dto.type.toUpperCase()}] Message from ${dto.name}`;

    const html = `
      <h2>New ${dto.type}</h2>
      <p><b>Name:</b> ${dto.name}</p>
      <p><b>Email:</b> ${dto.email}</p>
      <p><b>Phone:</b> ${dto.phone ?? '-'}</p>
      <p><b>Client IP:</b> ${clientIp ?? '-'}</p>
      <hr/>
      <p><b>Message:</b></p>
      <p style="white-space:pre-line;">${dto.message}</p>
    `;

    try {
      const result = await this.transporter.sendMail({
        from: `"${MAIL_FROM_NAME || 'Support'}" <${GMAIL_USER}>`,
        to: MAIL_TO,
        replyTo: dto.email,
        subject,
        html,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('EMAIL SEND FAILED:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}