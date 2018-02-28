'use strict';

const uuid = require('uuid/v4');

const action = (req, res) => {
  res.render('ResetPassword/views/complete', {
    title: 'Password has been reset',
    uuid: uuid(),
    clientId: req.session.clientId,
    redirectUri: req.session.redirectUri,
  });
};

module.exports = action;
