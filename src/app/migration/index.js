'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./getMigrationIntro');
const migratedUserDetails = require('./getMigratedUserDetails');
const migratedEmail = require('./getMigratedEmail');
const postMigratedEmail = require('./postMigratedEmail');
const getConfirmMigratedEmail = require('./getConfirmMigratedEmail');
const getCreateNewPassword = require('./getCreateNewPassword');
const getMigrationComplete = require('./getMigrationComplete');
const postCreateNewPassword = require('./postCreateNewPassword');
const postConfirmMigratedEmail = require('./postConfirmMigratedEmail');
const getEmailInUse = require('./getEmailInUse');
const postEmailInUse = require('./postEmailInUse');
const getAlreadyMigrated = require('./getAlreadyMigrated');
const getServiceAccessDenied = require('./getServiceAccessDenied');


const router = express.Router({ mergeParams: true });

const registerRoutes = (csrf) => {
  logger.info('Mounting Migration routes');
  router.get('/', csrf, asyncWrapper(get));
  router.get('/userDetails', csrf, asyncWrapper(migratedUserDetails));
  router.get('/email', csrf, asyncWrapper(migratedEmail));
  router.get('/:emailConfId/email-in-use', csrf, asyncWrapper(getEmailInUse));
  router.post('/:emailConfId/email-in-use', csrf, asyncWrapper(postEmailInUse));
  router.post('/email', csrf, asyncWrapper(postMigratedEmail));
  router.get('/:emailConfId/confirm-email', csrf, asyncWrapper(getConfirmMigratedEmail));
  router.post('/:emailConfId/confirm-email', csrf, asyncWrapper(postConfirmMigratedEmail));
  router.get('/:emailConfId/new-password', csrf, asyncWrapper(getCreateNewPassword));
  router.get('/complete', csrf, asyncWrapper(getMigrationComplete));
  router.post('/:emailConfId/new-password', csrf, asyncWrapper(postCreateNewPassword));
  router.get('/already-migrated', csrf, asyncWrapper(getAlreadyMigrated));
  router.get('/service-access-denied', csrf, asyncWrapper(getServiceAccessDenied));


  return router;
};

module.exports = registerRoutes;
