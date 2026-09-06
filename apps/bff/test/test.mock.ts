import { LoggerModule } from 'nestjs-pino';

export const LoggerModuleMock = LoggerModule.forRoot({
  pinoHttp: {
    transport: {
      target: 'pino/file',
      options: {
        destination: `./test/test.log`,
      },
    },
  },
});
