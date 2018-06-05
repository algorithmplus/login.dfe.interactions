'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const organisationApi = require('./../../infrastructure/Organisations');
const InteractionComplete = require('./../InteractionComplete');

const router = express.Router({ mergeParams: true });

const getAction = async (req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    return InteractionComplete.process(req.params.uuid, { status: 'failed', uid: req.query.uid, type: 'select-organisation', reason: "Missing uid"}, req, res);
  }

  const orgsForUser = await organisationApi.associatedWithUser(uid);

  if (!orgsForUser || orgsForUser.length === 0) {
    return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation: JSON.stringify({}) }, req, res);
  }

  if (orgsForUser.length === 1) {
    return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation: JSON.stringify(orgsForUser[0].organisation) }, req, res);
  }

  return res.render('select-organisation/views/index', {
    orgsForUser,
    csrfToken: req.csrfToken(),
    code: '',
    validationMessages: {},
  });
};

const postAction = async (req, res) => {
  const uid = req.query.uid;
  if (!req.body['selected-organisation']) {
    const orgsForUser = await organisationApi.associatedWithUser(uid);
    return res.render('select-organisation/views/index', {
      orgsForUser,
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: {
        organisation: 'Please select an organisation',
      },
    });
  }
  const organisation = req.body['selected-organisation'];

  return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation }, req, res);
};

const registerRoutes = (csrf) => {
  logger.info('Mounting Select Organisation routes');

  router.get('/', csrf, asyncWrapper(getAction));
  router.post('/', csrf, asyncWrapper(postAction));

  return router;
};

module.exports = registerRoutes;