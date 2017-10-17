'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/newpassword', {
    csrfToken: req.csrfToken(),
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
