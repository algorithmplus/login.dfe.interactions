'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../../logger/index');

const router = express.Router({ mergeParams: true });

module.exports = (csrf) => {
  logger.info('Mounting dev routed');

  router.get('/', (req, res) => {
    res.render('DevLauncher/views/launchpad', {
      uuid: uuid(),
    });
  });
  router.post('/dev/:uuid/complete', (req, res) => {
    res.render('DevLauncher/views/complete', { data: req.body });
  });
  router.get('/dev/styleguide', (req, res) => {
    res.render('DevLauncher/views/styleguide', {
      title: 'Styleguide'
    });
  });
  router.get('/dev/complete', (req, res) => {
    res.render('InteractionComplete/views/index', {
      noredirect: 'true',
      destination: '',
      postbackData: [],
      data: req.body,
    });
  });

  return router;
};
