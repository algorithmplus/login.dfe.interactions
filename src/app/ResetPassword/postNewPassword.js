'use strict';

const users = require('./../../infrastructure/Users');
const userCodes = require('./../../infrastructure/UserCodes');
const { passwordPolicy } = require('login.dfe.validation');
const logger = require('./../../infrastructure/logger');

const validate = (newPassword, confirmPassword) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter a password';
    failed = true;
  } else if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
    messages.newPassword = 'Please enter a password of at least 12 characters';
    failed = true;
  }

  if (confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  } else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Please enter matching passwords';
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

  await users.changePassword(req.session.uid, req.body.newPassword, req.id);

  const userCode = await userCodes.getCode(req.session.uid);

  await userCodes.deleteCode(req.session.uid);

  logger.audit(`Successful reset password for user id: ${req.session.uid}`, {
    type: 'reset-password',
    success: true,
    userId: req.session.uid,
  });

  req.session.redirectUri = userCode.userCode.redirectUri;
  res.redirect(`/${req.params.uuid}/resetpassword/complete`);
};

module.exports = action;
