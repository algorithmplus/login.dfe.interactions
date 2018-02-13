'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    title: 'Enter your verification code',
    uid: req.params.uid,
    clientId: req.query.clientid,
    redirectUri: req.query.redirect_uri,
    code: '',
    resend: req.session.resend,
    email: req.session.email,
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
