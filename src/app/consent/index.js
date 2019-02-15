'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const appendInteractionDetails = require('./../utils/appendInteractionDetails');

const grantAccess = require('./grantAccess');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting smsCode routes');

  router.use(appendInteractionDetails);

  router.get('/', csrf, asyncWrapper(grantAccess.get));

  return router;
};

module.exports = registerRoutes;
