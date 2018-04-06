'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./getMigrationIntro');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Migration routes');
  router.get('/', csrf, asyncWrapper(get));

  return router;
};

module.exports = registerRoutes;
