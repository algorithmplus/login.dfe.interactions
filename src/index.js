const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const csurf = require('csurf');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const config = require('./Config');
const usernamePassword = require('./UsernamePassword');
const devLauncher = require('./DevLauncher');

const csrf = csurf({ cookie: true });

const logLevel = config.loggerSettings.logLevel || 'info';

const logger = new (winston.Logger)({
  colors: config.loggerSettings.colors,
  transports: [
    new (winston.transports.Console)({ level: logLevel, colorize: true }),
  ],
});


// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.set('logger', logger);

// Setup express layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Setup routes
app.use('/', devLauncher(csrf, logger));
app.use('/:uuid/usernamepassword', usernamePassword(csrf, logger));

// Setup server
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  const https = require('https');
  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false,
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
}


process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});
