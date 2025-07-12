// src/loggers/app-name.logger.ts
import { ConsoleLogger } from '@nestjs/common';
import { AppInfo } from 'src/helpers/env.config';


export class AppNameLogger extends ConsoleLogger {
  private appName = AppInfo.fullName;

  override formatPid(pid: number): string {
    return `[${this.appName}] ${pid} - `;
  }
}
