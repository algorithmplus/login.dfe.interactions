'use strict';

const express = require('express');
const logger = require('../logger');

const getRequestPasswordReset = require('./getRequestPasswordReset');
const postRequestPasswordReset = require('./postRequestPasswordReset');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting ResetPassword routes');

  router.get('/request', csrf, getRequestPasswordReset);
  router.post('/request', csrf, postRequestPasswordReset);

  // router.get('/confirm', csrf, null);
  // router.port('/confirm', csrf, null);

  // router.get('/complete', csrf, null);
  // router.port('/complete', csrf, null);

  return router;
};

module.exports = registerRoutes;