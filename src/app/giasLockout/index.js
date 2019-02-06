'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const appendInteractionDetails = require('./../utils/appendInteractionDetails');

const announcements = require('./announcements');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting smsCode routes');

  router.use(appendInteractionDetails);

  router.get('/', csrf, asyncWrapper(announcements.get));

  return router;
};

module.exports = registerRoutes;
