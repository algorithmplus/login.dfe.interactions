'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./getMigrationIntro');
const migratedUserDetails = require('./getMigratedUserDetails');
const migratedEmail = require('./getMigratedEmail');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Migration routes');
  router.get('/', csrf, asyncWrapper(get));
  router.get('/userDetails', csrf, asyncWrapper(migratedUserDetails));
  router.get('/email', csrf, asyncWrapper(migratedEmail))
  return router;
};

module.exports = registerRoutes;
