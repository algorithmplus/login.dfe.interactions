'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/complete', {
    title: 'Reset your password',
    redirectUri: req.session.redirectUri,
  });
};

module.exports = action;
