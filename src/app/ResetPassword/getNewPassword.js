'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/newpassword', {
    csrfToken: req.csrfToken(),
    title: 'Set your password',
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
