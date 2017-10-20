'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const get = require('./getUsernamePassword');
const post = require('./postUsernamePassword');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting UsernamePassword routes');
  router.get('/', csrf, get);
  router.post('/', csrf, post);

  return router;
};

module.exports = registerRoutes;
