import winston, { transport } from 'winston';

const transports: transport[] = [];

const devEnvConsoleFormat = () =>
  winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(info => {
      const { level, message } = info;
      return `${level}: ${message}`;
    })
  );

const consoleTransport = new winston.transports.Console({
  level: process.env.LOG_CONSOLE_LEVEL || process.env.LOG_LEVEL || 'debug',
  format: devEnvConsoleFormat(),
  handleExceptions: true,
});

const fileTransport = new winston.transports.File({
  level: process.env.LOG_LEVEL || 'debug',
  filename: `logs/log-${process.env.NODE_ENV}.log`,
  handleExceptions: true,
});

transports.push(fileTransport);

if (process.env.LOG_CONSOLE === 'on') {
  transports.push(consoleTransport);
}

const logger = winston.createLogger({
  defaultMeta: {
    env: process.env.DD_ENV,
    service: process.env.DD_SERVICE,
  },
  transports,
});

export default logger;
