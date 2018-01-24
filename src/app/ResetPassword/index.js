'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const getRequestPasswordReset = require('./getRequestPasswordReset');
const postRequestPasswordReset = require('./postRequestPasswordReset');
const getConfirmPasswordReset = require('./getConfirmPasswordReset');
const postConfirmPasswordReset = require('./postConfirmPasswordReset');
const getNewPassword = require('./getNewPassword');
const postNewPassword = require('./postNewPassword');
const getComplete = require('./getComplete');
const hasConfirmedIdentity = require('./hasConfirmedIdentity');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting ResetPassword routes');

  router.get('/request', csrf, getRequestPasswordReset);
  router.post('/request', csrf, postRequestPasswordReset);

  router.get('/:uid/confirm', csrf, getConfirmPasswordReset);
  router.post('/:uid/confirm', csrf, postConfirmPasswordReset);

  router.get('/newpassword', csrf, hasConfirmedIdentity, getNewPassword);
  router.post('/newpassword', csrf, hasConfirmedIdentity, postNewPassword);

  router.get('/complete', csrf, hasConfirmedIdentity, getComplete);

  return router;
};

module.exports = registerRoutes;
