'use strict';

const express = require('express');
const Config = require('./../Config');
const InteractionComplete = require('./../InteractionComplete');

const get = require('./getUsernamePassword');
const post = require('./postUsernamePassword');

const router = express.Router({mergeParams: true});

module.exports = (csrf) => {

  router.get('/', csrf, get);
  router.post('/', csrf, post);

  return router;

};