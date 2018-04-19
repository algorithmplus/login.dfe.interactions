'use strict';

const users = require('./../../infrastructure/Users');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const { validate } = require('./../utils/validatePassword');

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
