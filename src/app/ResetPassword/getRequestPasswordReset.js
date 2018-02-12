'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/request', {
    csrfToken: req.csrfToken(),
    title: 'Forgotten your password?',
    email: '',
    uuid: req.params.uuid,
    clientId: req.query.clientid,
    redirectUri: req.query.redirect_uri,
    validationMessages: {},
    validationFailed: false,
  });
};

module.exports = action;
