'use strict';

const get = (req, res) => {
  res.render('UsernamePassword/views/index', {
    isFailedLogin: false,
    message: '',
    title: 'Sign in',
    clientId: req.query.clientid,
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    redirectUri: req.query.redirect_uri,
    validationMessages: {},
  });
};

module.exports = get;
