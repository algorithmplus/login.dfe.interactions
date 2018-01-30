'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const captureDigipassCode = require('./captureDigipassCode');
const validateDigipassCode = require('./validateDigipassCode');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Digipass routes');

  router.get('/', csrf, captureDigipassCode);
  router.post('/', csrf, validateDigipassCode);

  return router;
};

module.exports = registerRoutes;
