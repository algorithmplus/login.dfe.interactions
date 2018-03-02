'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

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

  router.get('/request', csrf, asyncWrapper(getRequestPasswordReset));
  router.post('/request', csrf, asyncWrapper(postRequestPasswordReset));

  router.get('/:uid/confirm', csrf, asyncWrapper(getConfirmPasswordReset));
  router.post('/:uid/confirm', csrf, asyncWrapper(postConfirmPasswordReset));

  router.get('/newpassword', csrf, hasConfirmedIdentity, asyncWrapper(getNewPassword));
  router.post('/newpassword', csrf, hasConfirmedIdentity, asyncWrapper(postNewPassword));

  router.get('/complete', csrf, hasConfirmedIdentity, asyncWrapper(getComplete));

  return router;
};

module.exports = registerRoutes;
