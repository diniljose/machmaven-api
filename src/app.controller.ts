import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
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
  try {
    const parts = req.parts();

    let dto: Partial<SendMailDto> = {};
let uploadedFile: {
  filename: string;
  mimetype: string;
  buffer: Buffer;
} | null = null;

    console.log("Request started");

    for await (const part of parts) {

      if (part.type === 'file') {
        console.log("Processing file:", part.filename);

        uploadedFile = {
          filename: part.filename,
          mimetype: part.mimetype,
          buffer: await part.toBuffer(),
        };

        console.log(
          "File received:",
          uploadedFile.filename,
          uploadedFile.buffer.length
        );

      } else {
        dto[part.fieldname] = part.value;
      }
    }

    console.log("Multipart parsing completed");
    console.log("DTO:", dto);


    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      req.ip;


    console.log("Sending mail...");

    const result = await this.mailService.sendSupportMail(
      dto as SendMailDto,
      uploadedFile,
      clientIp,
    );

    console.log("Mail sent successfully");

    return result;


  } catch (error) {

    console.error("Send mail error:", error);

    throw new BadRequestException(
      error || "Failed to send mail"
    );
  }
}
}
