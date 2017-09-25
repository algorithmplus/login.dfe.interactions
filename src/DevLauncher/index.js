'use strict';

const express = require('express');
const uuid = require('uuid/v4');

const router = express.Router({mergeParams: true});

module.exports = (csrf) => {

  router.get('/', function (req, res) {
    res.render('dev/launchpad', {
      uuid: uuid(),
    });
  });
  router.post('/dev/:uuid/complete', function (req, res) {
    res.render('dev/complete', {data: req.body});
  });
  router.get('/dev/complete', function (req, res) {
    res.render('interactioncomplete/index', {noredirect: 'true', destination: '', postbackData: [], data: req.body });
  });

  return router;

};