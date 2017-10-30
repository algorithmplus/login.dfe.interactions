'use strict';

const clients = require('./../../infrastructure/Clients');
const users = require('./../../infrastructure/Users');
const userCodes = require('./../../infrastructure/UserCodes');
const {passwordPolicy} = require('login.dfe.validation');
const logger = require('./../../infrastructure/logger');

const validate = (newPassword, confirmPassword) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter your new password';
    failed = true;
  }
  else if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
    messages.newPassword = 'Your password does not meet the minimum requirements';
    failed = true;
  }

  if (confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  } else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Passwords do not match';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const validationResult = validate(req.body.newPassword, req.body.confirmPassword);

  if (validationResult.failed) {
    res.render('ResetPassword/views/newpassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages,
    });
    return;
  }

  const client = await clients.get(req.session.clientId);

  users.changePassword(req.session.uid, req.body.newPassword, client);

  userCodes.deleteCode(req.session.uid);

  logger.audit(`Successful reset password for user id: ${req.session.uid}`, {
    type: 'reset-password',
    success: true,
    userId: req.session.uid,
  });

  res.redirect(`/${req.params.uuid}/resetpassword/complete`);
};

module.exports = action;
