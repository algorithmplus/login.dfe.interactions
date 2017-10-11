'use strict';

const validate = (newPassword, confirmPassword) => {
  const messages = {
    newPassword: '',
    confirmPassword: ''
  };
  let failed = false;

  if(newPassword.length === 0) {
    messages.newPassword = 'Please enter your new password';
    failed = true;
  }

  if(confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  }
  else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Passwords do not match';
    failed = true;
  }

  return {
    failed,
    messages
  };
};

const action = (req, res) => {
  const validationResult = validate(req.body.newPassword, req.body.confirmPassword);

  if(validationResult.failed) {
    res.render('ResetPassword/views/newpassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages
    });
  } else {
    res.redirect(`/${req.params.uuid}/resetpassword/complete`);
  }
};

module.exports = action;