'use strict';

var emailValidator = require("email-validator");

const validate = (email, code) => {
  const messages = {
    email: '',
    code: ''
  };
  let failed = false;

  if (email.length === 0) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  }
  else if (!emailValidator.validate(email)) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  }

  if (code.length === 0) {
    messages.code = 'Please enter the code that was emailed to you';
    failed = true;
  }

  return {
    failed,
    messages
  }
};

const action = (req, res) => {
  const validationResult = validate(req.body.email, req.body.code);

  if(validationResult.failed) {
    res.render('ResetPassword/views/confirm', {
      csrfToken: req.csrfToken(),
      email: req.body.email,
      code: req.body.code,
      validationFailed: true,
      validationMessages: validationResult.messages
    });
  } else {
    res.redirect(`${req.params.uuid}/resetpassword/newpassword`);
  }
};

module.exports = action;