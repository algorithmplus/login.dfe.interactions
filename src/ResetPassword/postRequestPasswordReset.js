'use strict';
var emailValidator = require("email-validator");

const validate = (email) => {
  const messages = {
    email: ''
  };
  let failed = false;

  if (email.length === 0) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  }
  else if(!emailValidator.validate(email)) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  }

  return {
    messages,
    failed
  };
}

const action = (req, res) => {
  const email = req.body.email;
  const validationResult = validate(email);

  if (validationResult.failed) {
    res.render('resetpassword/request', {
      csrfToken: req.csrfToken(),
      email,
      validationFailed: validationResult.failed,
      validationMessages: validationResult.messages
    });
  }
  else {
    res.render('resetpassword/codesent');
  }
};

module.exports = action;