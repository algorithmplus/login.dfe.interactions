'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const appendInteractionDetails = require('./../utils/appendInteractionDetails');

const grantAccess = require('./grantAccess');
const selectOrganisation = require('./selectOrganisation');

const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting smsCode routes');

  router.use(asyncWrapper(appendInteractionDetails));

  router.get('/', csrf, asyncWrapper(grantAccess.get));
  router.post('/', csrf, asyncWrapper(grantAccess.post));
  router.get('/select-organisation', csrf, asyncWrapper(selectOrganisation.getOrganisation));
  router.post('/select-organisation', csrf, asyncWrapper(selectOrganisation.postOrganisation));
  return router;
};

module.exports = registerRoutes;
