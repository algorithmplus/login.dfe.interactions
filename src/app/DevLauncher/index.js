'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');

const router = express.Router({ mergeParams: true });

module.exports = (csrf) => {
  logger.info('Mounting dev routed');

  router.get('/', (req, res) => {
    res.render('dev/launchpad', {
      uuid: uuid(),
    });
  });
  router.post('/dev/:uuid/complete', (req, res) => {
    res.render('dev/complete', { data: req.body });
  });
  router.get('/dev/complete', (req, res) => {
    res.render('interactioncomplete/index', {
      noredirect: 'true',
      destination: '',
      postbackData: [],
      data: req.body,
    });
  });

  return router;
};
