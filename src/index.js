const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./Routes');
const config = require('./Config');

const app = express();

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Setup express layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Setup routes
routes.register(app);

// Setup server
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  const https = require('https');
  const options = {
    key: fs.readFileSync('./ssl/localhost.key'),
    cert: fs.readFileSync('./ssl/localhost.cert'),
    requestCert: false,
    rejectUnauthorized: false,
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    console.log(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
} else {
  app.listen(config.hostingEnvironment.port, () => {
    console.log(`Dev server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
}
