const winston = require('winston');

require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  filename: `${__dirname}/../logs/batch-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '365d',
});

const timezoned = () => new Date().toLocaleString('ko-KR', {
  timeZone: 'Asia/Seoul',
});

// options for logger object
const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/info.log`,
    handleExceptions: true,
    json: true,
    maxsize: '10m',
    maxFiles: 1,
    colorize: true,
    prettyPrint: true,
  },
  errfile: {
    level: 'error',
    filename: `${__dirname}/../logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: '10m',
    maxFiles: 10,
    colorize: true,
    prettyPrint: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
  },
};

// logger object with above defined options
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.errfile),
    new winston.transports.Console(options.console),
    transport,
  ],
  format:
      winston.format.combine(winston.format.simple(),
        winston.format.timestamp({
          format: timezoned,
        }),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
  exitOnError: false,
});

module.exports = logger;