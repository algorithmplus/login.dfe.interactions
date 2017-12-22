'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/request', {
    csrfToken: req.csrfToken(),
    title: 'Reset your password',
    email: '',
    validationMessages: {},
    validationFailed: false,
    uuid: req.params.uuid,
    clientid: req.query.clientid
  });
};

module.exports = action;
