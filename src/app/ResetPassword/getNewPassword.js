'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/newpassword', {
    csrfToken: req.csrfToken(),
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {
      newPassword: '',
      confirmPassword: ''
    }
  });
};

module.exports = action;