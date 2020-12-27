import fs from 'fs';
import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = winston.format;

let logPath: string = process.env.NODE_ENV === 'development' ? './log/push-notification' : '/var/log/push-notification';

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath, { recursive: true });
}

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}--${level}--${message}`;
});

const transports: DailyRotateFile[] = [
  new DailyRotateFile({
    level: 'info',
    filename: `${logPath}/info-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '2048m',
    maxFiles: '31d',
  }),
  new DailyRotateFile({
    level: 'error',
    filename: `${logPath}/error-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '2048m',
    maxFiles: '31d',
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    // @ts-ignore
    new winston.transports.Console({
      level: 'debug',
    })
  );
}

function getLogger(): Logger {
  const logger: Logger = winston.createLogger({
    format: combine(timestamp(), colorize(), myFormat),
    transports: transports,
  });
  return logger;
}

export default getLogger();
