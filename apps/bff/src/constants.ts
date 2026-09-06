import * as process from 'process';
import pino from 'pino';
import * as uuid from 'uuid';
import { Params } from 'nestjs-pino';
import { Options } from 'pino-http';
import * as momentTimezone from 'moment-timezone';
import * as moment from 'moment';

export const yooKassaIps = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.156.11',
  '77.75.156.35',
  '77.75.154.128/25',
  '2a02:5180::/32',
];

export const checkYooKassaIp = (ip: string): boolean => {
  if (yooKassaIps.includes(ip)) {
    return true;
  }
  const ipp = ip.split('.');
  const partOfIp = [`${ipp[0]}.${ipp[1]}.${ipp[2]}.`, ipp[3]];

  const partsOfIps = yooKassaIps.filter((i) => i.includes(partOfIp[0]));

  if (partsOfIps.length !== 0) {
    const exp = partOfIp[1] === '0' ? 0 : Number(partOfIp[1]);

    const result = partsOfIps.filter((item) => {
      const tmp = item.split('.')[3];

      switch (tmp) {
        case '0/25':
          return exp >= 0 && exp <= 127;
        case '0/27':
          return exp >= 0 && exp <= 31;
        case '128/25':
          return exp >= 128 && exp <= 255;
        default:
          return false;
      }
    });

    return result.length !== 0;
  } else {
    return false;
  }
};

const getReqId = (req, res) => {
  const requestIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  return requestIp ?? uuid.v4();
};

const PinoStreamTargets = (): Options => {
  return {
    stream: pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination: `logs/system.log` },
          level: process.env.LOG_LEVEL ?? 'info',
        },
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
          level: process.env.LOG_LEVEL ?? 'info',
        },
      ],
    }),
  };
};

const PinoTransport = (): Options => {
  return {
    formatters: {
      level(label, number) {
        return { level: label };
      },
    },
    transport: {
      target: 'pino/file',
      options: { destination: `logs/system.log` },
    },
  };
};

export const LoggerParams = (): Params => {
  return {
    pinoHttp: {
      level: process.env.LOG_LEVEL ?? 'info',
      timestamp: () => {
        return `, "time": "${momentTimezone
          .tz(moment(), 'Europe/Moscow')
          .format(moment.defaultFormat)}"`;
      },
      ...(process.env.NODE_ENV === 'PROD'
        ? PinoTransport()
        : PinoStreamTargets()),
      genReqId: getReqId,
      messageKey: 'message',
      errorKey: 'error',
      nestedKey: 'payload',
    },
  };
};
