'use strict';

const winston = require('winston');
const config = require('./../Config')();

const logLevel = (config && config.loggerSettings && config.loggerSettings.logLevel) ? config.loggerSettings.logLevel : 'info';
const colors = (config && config.loggerSettings && config.loggerSettings.colors) ? config.loggerSettings.colors : null;

const logger = new (winston.Logger)({
  colors: colors,
  transports: [
    new (winston.transports.Console)({ level: logLevel, colorize: true }),
  ],
});

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});

module.exports = logger;
