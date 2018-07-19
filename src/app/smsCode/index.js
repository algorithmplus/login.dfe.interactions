'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const authCode = require('./authCode');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting smsCode routes');

  router.get('/', csrf, asyncWrapper(authCode.get));
  router.post('/', csrf, asyncWrapper(authCode.post));

  return router;
};

module.exports = registerRoutes;
