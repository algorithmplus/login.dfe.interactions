const logger = require('./infrastructure/logger');
const appInsights = require('applicationinsights');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const csurf = require('csurf');
const morgan = require('morgan');
const session = require('express-session');
const https = require('https');
const config = require('./infrastructure/Config')();
const helmet = require('helmet')

const rateLimiter = require('./app/rateLimit');

const usernamePassword = require('./app/UsernamePassword');
const resetPassword = require('./app/ResetPassword');
const digipass = require('./app/Digipass');
const devLauncher = require('./app/DevLauncher');
const setCorrelationId = require('express-mw-correlation-id');


const { interactionsSchema, validateConfigAndQuitOnError } = require('login.dfe.config.schema');

validateConfigAndQuitOnError(interactionsSchema, config, logger);

if (config.hostingEnvironment.applicationInsights) {
  appInsights.setup(config.hostingEnvironment.applicationInsights).start();
}

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
  cookie: {},
};

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(rateLimiter);
app.use(session(sess));

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

// Set view engine
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.set('views', path.resolve(__dirname, 'app'));
app.set('logger', logger);

// Setup express layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Setup routes
app.use('/', devLauncher(csrf));
app.use('/:uuid/usernamepassword', usernamePassword(csrf));
app.use('/:uuid/resetpassword', resetPassword(csrf));
app.use('/:uuid/digipass', digipass(csrf));

// Setup global locals for layouts and views
Object.assign(app.locals, {
  portal: {
    url: config.hostingEnvironment.portalUrl,
  },
  app: {
    title: 'Login.Dfe',
  },
});

// Setup global locals for layouts and views
Object.assign(app.locals, {
  portal: {
    url: config.hostingEnvironment.portalUrl,
  },
  app: {
    title: 'Login.Dfe',
  },
});

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
