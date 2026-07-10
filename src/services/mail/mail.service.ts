import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from 'src/app.dto';
import { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO, MAIL_FROM_NAME } from 'src/constants';


const MAX_FILE_SIZE = 10 * 1024 * 1024;


const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

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


private async processAttachment(file: any) {
  if (!file) return null;

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(
      'Only PDF, DOC, DOCX, JPG and PNG files are allowed.',
    );
  }

  if (!file.buffer) {
    throw new BadRequestException(
      'Invalid attachment data.',
    );
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    throw new BadRequestException(
      'Maximum allowed file size is 10MB.',
    );
  }

  return {
    filename: file.filename,
    content: file.buffer,
    contentType: file.mimetype,
  };
}
 async sendSupportMail(
  dto: SendMailDto,
  file: any,
  clientIp?: string,
) {
  if (!MAIL_TO) {
    throw new Error('Missing MAIL_TO in environment');
  }

  const attachment = await this.processAttachment(file);

 const subject = dto?.type || 'SUPPORT';

const html = `


  <table cellpadding="6" cellspacing="0" border="1">
    <tr><td><b>Name</b></td><td>${dto?.name}</td></tr>
    <tr><td><b>Email</b></td><td>${dto?.email}</td></tr>
    <tr><td><b>Phone</b></td><td>${dto?.phone ?? '-'}</td></tr>
    <tr><td><b>Material / Quantity</b></td><td>${dto?.material ?? '-'}</td></tr>
    <tr><td><b>Delivery Target</b></td><td>${dto?.deliveryTarget ?? '-'}</td></tr>
    <tr><td><b>Attachment</b></td><td>${attachment ? attachment?.filename : 'None'}</td></tr>
    <tr><td><b>Client IP</b></td><td>${clientIp ?? '-'}</td></tr>
  </table>

  <br/>

  <h3>Message</h3>

  <div style="
    border:1px solid #ddd;
    padding:15px;
    white-space:pre-wrap;
  ">
  ${dto.message}
  </div>
`;
  console.log(html);
  

  try {
    const result = await this.transporter.sendMail({
      from: `"${MAIL_FROM_NAME || 'Support'}" <${GMAIL_USER}>`,
      to: MAIL_TO,
      replyTo: dto.email,
      subject,
      html,
      attachments: attachment ? [attachment] : [],
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error(error);

    throw new InternalServerErrorException(
      'Failed to send email',
    );
  }
}
}