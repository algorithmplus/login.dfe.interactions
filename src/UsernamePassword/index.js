'use strict';

const express = require('express');
const Config = require('./../Config');
const InteractionComplete = require('./../InteractionComplete');

const router = express.Router({mergeParams: true});

module.exports = (csrf) => {

  router.get('/', csrf, function get(req, res) {
    res.render('usernamepassword/index', { isFailedLogin: false, message: '', csrfToken: req.csrfToken() });
  });

  router.post('/', csrf, function(req, res) {
    const user = Config.services.user.authenticate(req.body.username, req.body.password);

    if (user == null) {
      res.render('usernamepassword/index', { isFailedLogin: true, message: 'Login failed', csrfToken: req.csrfToken() });
      return;
    }

    InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
  });

  return router;

};