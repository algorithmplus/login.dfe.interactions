'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const captureDigipassCode = require('./captureDigipassCode');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Digipass routes');

  router.get('/', csrf, captureDigipassCode);

  return router;
};

module.exports = registerRoutes;