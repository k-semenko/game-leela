import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { WsAdapter } from './events/ws.adapter';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

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

  // WS
  app.useWebSocketAdapter(new WsAdapter(app));

  // Swagger configs
  const options: SwaggerCustomOptions = {
    jsonDocumentUrl: 'api/swagger',
  };
  const config = new DocumentBuilder()
    .setTitle('Game Leela API')
    .setDescription('API documentation for the Game Leela demo project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, options);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.APP_PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
