'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/request', {
    csrfToken: req.csrfToken(),
    title: 'Reset your password',
    email: '',
    validationMessages: {},
    validationFailed: false,
  });
};

module.exports = action;
