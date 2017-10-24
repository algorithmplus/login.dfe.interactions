'use strict';

const clients = require('./../../infrastructure/Clients');
const users = require('./../../infrastructure/Users');
const userCodes = require('./../../infrastructure/UserCodes');
const getPasswordPolicy = require('./../../infrastructure/PasswordPolicy').get;

const validate = (newPassword, confirmPassword, passwordPolicy) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter your new password';
    failed = true;
  }

  if (confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  } else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Passwords do not match';
    failed = true;
  }

  if (!failed) {
    passwordPolicy.rules.forEach((rule) => {
      if (!newPassword.match(rule.pattern)) {
        messages.newPassword = 'The password does not meet the password policy';
        failed = true;
      }
    });
  }

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const passwordPolicy = getPasswordPolicy();
  const validationResult = validate(req.body.newPassword, req.body.confirmPassword, passwordPolicy);

  if (validationResult.failed) {
    res.render('ResetPassword/views/newpassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages,
      passwordPolicy,
    });
    return;
  }

  const client = await clients.get(req.session.clientId);

  users.changePassword(req.session.uid, req.body.newPassword, client);

  userCodes.deleteCode(req.session.uid);

  res.redirect(`/${req.params.uuid}/resetpassword/complete`);
};

module.exports = action;
