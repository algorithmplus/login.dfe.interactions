'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('./../../infrastructure/logger');

const router = express.Router({ mergeParams: true });

module.exports = () => {
  logger.info('Mounting dev routed');

  router.get('/', (req, res) => {
    res.render('DevLauncher/views/launchpad', {
      uuid: uuid(),
    });
  });
  router.post('/:uuid/complete', (req, res) => {
    res.render('DevLauncher/views/complete', { data: req.body });
  });
  router.get('/styleguide', (req, res) => {
    res.render('DevLauncher/views/styleguide', {
      title: 'Styleguide',
    });
  });
  router.get('/complete', (req, res) => {
    res.render('InteractionComplete/views/index', {
      noredirect: 'true',
      destination: '',
      postbackData: [],
      data: req.body,
    });
  });

  router.get('/passwordresetnewpassword', (req, res) => {
    req.session.uid = '23121d3c-84df-44ac-b458-3d63a9a05497';
    req.session.clientId = 'local';
    res.redirect(`/${req.query.uuid}/resetpassword/newpassword?clientid=local&redirect_uri=https://localhost:4431`);
  });
  router.get('/passwordresetcomplete', (req, res) => {
    req.session.uid = '23121d3c-84df-44ac-b458-3d63a9a05497';
    req.session.clientId = 'local';
    res.redirect(`/${req.query.uuid}/resetpassword/complete?clientid=local&redirect_uri=https://localhost:4431`);
  });


  router.get('/:uuid/check', (req, res) => {
    return res.json({
      client_id: 'local',
      redirect_uri: 'https://localhost:4431',
      uid: '23121d3c-84df-44ac-b458-3d63a9a05497',
      oid: 'fa460f7c-8ab9-4cee-aaff-82d6d341d702',
    });
  });

  return router;
};
