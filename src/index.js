const logger = require('./infrastructure/logger');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const csurf = require('csurf');
const session = require('cookie-session');
const http = require('http');
const https = require('https');
const config = require('./infrastructure/Config')();
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');
const healthCheck = require('login.dfe.healthcheck');
const { getErrorHandler, ejsErrorPages } = require('login.dfe.express-error-handling');
const KeepAliveAgent = require('agentkeepalive');

// const rateLimiter = require('./app/rateLimit');

const usernamePassword = require('./app/UsernamePassword');
const migrationUser = require('./app/migration');
const resetPassword = require('./app/ResetPassword');
const digipass = require('./app/Digipass');
const selectOrganisation = require('./app/select-organisation');
const devLauncher = require('./app/DevLauncher');
const content = require('./app/Content');
const setCorrelationId = require('express-mw-correlation-id');


const { interactionsSchema, validateConfigAndQuitOnError } = require('login.dfe.config.schema');

validateConfigAndQuitOnError(interactionsSchema, config, logger);

http.GlobalAgent = new KeepAliveAgent({
  maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
  maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
  timeout: config.hostingEnvironment.agentKeepAlive.timeout,
  keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
});
https.GlobalAgent = new KeepAliveAgent({
  maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
  maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
  timeout: config.hostingEnvironment.agentKeepAlive.timeout,
  keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
});

let expiryInMinutes = 30;
const sessionExpiry = parseInt(config.hostingEnvironment.sessionCookieExpiryInMinutes);
if (!isNaN(sessionExpiry)) {
  expiryInMinutes = sessionExpiry;
}

const expiryInMilliseconds = 60000 * expiryInMinutes;

const app = express();

app.use(helmet({
  noCache: true,
  frameguard: {
    action: 'deny',
  },
}));
app.use(setCorrelationId(true));

const csrf = csurf({
  cookie: {
    secure: true,
    httpOnly: true,
  },
});

const sess = {
  secret: config.session.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: expiryInMilliseconds,
  },
};

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}

// app.use(rateLimiter);
app.use(session(sess));

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitization({
  sanitizer: (key, value) => {
    if (key.toLowerCase() === 'clientid') {
      return !/^[A-Za-z0-9]+$/.test(value) ? '' : value;
    }
    return sanitization.defaultSanitizer(key, value);
  },
}));


// Set view engine
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.set('views', path.resolve(__dirname, 'app'));
app.set('logger', logger);

// Setup express layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Setup routes
app.use('/healthcheck', healthCheck({ config }));
app.use('/', content(csrf));

app.use('/:uuid/usernamepassword', usernamePassword(csrf));
app.use('/:uuid/migration', migrationUser(csrf));
app.use('/:uuid/resetpassword', resetPassword(csrf));
app.use('/:uuid/digipass', digipass(csrf));
app.use('/:uuid/select-organisation', selectOrganisation(csrf));

if (config.hostingEnvironment.useDevViews) {
    app.use('/dev/', devLauncher(csrf));
}

// Setup global locals for layouts and views
Object.assign(app.locals, {
  urls: {
    help: config.hostingEnvironment.helpUrl,
  },
  app: {
    title: 'DfE Sign-in',
  },
  gaTrackingId: config.hostingEnvironment.gaTrackingId,
});

// error handling
const errorPageRenderer = ejsErrorPages.getErrorPageRenderer({
  help: config.hostingEnvironment.helpUrl,
}, config.hostingEnvironment.env === 'dev');
app.use(getErrorHandler({
  logger,
  errorPageRenderer,
}));

// Setup server
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

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
