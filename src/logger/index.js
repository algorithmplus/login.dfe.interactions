'use strict';

const winston = require('winston');
const config = require('./../Config');

const logLevel = config.loggerSettings.logLevel || 'info';

const logger = new (winston.Logger)({
  colors: config.loggerSettings.colors,
  transports: [
    new (winston.transports.Console)({ level: logLevel, colorize: true }),
  ],
});

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});

module.exports = logger;