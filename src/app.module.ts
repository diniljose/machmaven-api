import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TranslationService } from './services/translation/translation.service';
import { ResponseService } from './services/response/response.service';
import { MailService } from './services/mail/mail.service';

import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import { getEnvFilePath } from './helpers/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
    }),

    // ✅ Global Rate Limiting (Anti-Spam)
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 60 seconds
        limit: 5, // max 5 requests per minute per IP
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TranslationService,
    ResponseService,
    MailService,

    // ✅ Global Custom Validation Pipe
    {
      provide: APP_PIPE,
      useFactory: (responseService: ResponseService) => {
        return new CustomValidationPipe(responseService);
      },
      inject: [ResponseService],
    },

    // ✅ Global Throttler Guard (applies to all endpoints)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}