import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMailDto } from './app.dto';
import { MailService } from './services/mail/mail.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly mailService: MailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send')
  async sendMail(@Body() dto: SendMailDto, @Req() req: Request) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress;

    return await this.mailService.sendSupportMail(dto, clientIp);
  }
}
