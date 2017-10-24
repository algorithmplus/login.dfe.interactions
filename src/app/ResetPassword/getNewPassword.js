'use strict';

const getPasswordPolicy = require('./../../infrastructure/PasswordPolicy').get;

const action = (req, res) => {
  res.render('ResetPassword/views/newpassword', {
    csrfToken: req.csrfToken(),
    title: 'Reset your password',
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
    passwordPolicy: getPasswordPolicy(),
  });
};

module.exports = action;
