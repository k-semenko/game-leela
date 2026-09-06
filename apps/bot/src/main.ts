import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import * as process from 'process';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as fs from 'fs';

async function bootstrap() {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs', 744);
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Logger configs
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.flushLogs();

  // TgBot
  app.get(getBotToken());
  app.setGlobalPrefix('tg');

  await app.listen(process.env.APP_PORT).then(() => {
    logger.log(`App started at port ${process.env.APP_PORT}`);
  });
}

bootstrap();
