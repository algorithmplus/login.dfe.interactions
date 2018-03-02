'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./getUsernamePassword');
const post = require('./postUsernamePassword');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting UsernamePassword routes');
  router.get('/', csrf, asyncWrapper(get));
  router.post('/', csrf, asyncWrapper(post));

  return router;
};

module.exports = registerRoutes;
