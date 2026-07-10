import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMailDto } from './app.dto';
import { MailService } from './services/mail/mail.service';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly mailService: MailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

@Post('send')
async sendMail(@Req() req: FastifyRequest) {  
  const parts = req.parts();

  let dto: Partial<SendMailDto> = {};
  let uploadedFile: any;

  for await (const part of parts) {
    if (part.type === 'file') {
      uploadedFile = part;
    } else {
      dto[part.fieldname] = part.value;
    }
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
    req.ip;

  return this.mailService.sendSupportMail(
    dto as SendMailDto,
    uploadedFile,
    clientIp,
  );
}
}
