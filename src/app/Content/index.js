'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const router = express.Router({ mergeParams: true });

module.exports = () => {
  logger.info('Mounting static content routes');
  router.get('/', (req, res) => {
    res.render('Content/views/start', {
      title: 'DfE Sign-in',
    });
  });
  router.get('/terms', (req, res) => {
    res.render('Content/views/terms', {
      title: 'Terms and Conditions',
    });
  });
  router.get('/cookies', (req, res) => {
    res.render('Content/views/cookies', {
      title: 'Cookies',
    });
  });
  router.get('/help', (req, res) => {
    res.render('Content/views/help', {
      title: 'Help',
    });
  });
  return router;
};
