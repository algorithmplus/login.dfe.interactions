'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const captureDigipassCode = require('./captureDigipassCode');
const validateDigipassCode = require('./validateDigipassCode');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Digipass routes');

  router.get('/', csrf, asyncWrapper(captureDigipassCode));
  router.post('/', csrf, asyncWrapper(validateDigipassCode));

  return router;
};

module.exports = registerRoutes;
