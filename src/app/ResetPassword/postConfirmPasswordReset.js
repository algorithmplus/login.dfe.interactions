'use strict';

const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');

const validate = (code) => {
  const messages = {};
  let failed = false;

  if (code.length === 0) {
    messages.code = 'Please enter the code that was emailed to you';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const validationResult = validate(req.body.code);

  if (validationResult.failed) {
    res.render('ResetPassword/views/confirm', {
      csrfToken: req.csrfToken(),
      uid: req.body.uid,
      code: req.body.code,
      validationFailed: true,
      validationMessages: validationResult.messages,
    });
    return;
  }

  let userCode;
  try {
    userCode = await userCodes.validateCode(req.body.uid, req.body.code, req.id);
  } catch (e) {
    logger.info(`Error confirming password reset for ${req.body.email} correlationId: ${req.id}`);
    logger.info(e);
  }

  if (userCode) {
    req.session.uid = req.body.uid;
    req.session.clientId = req.query.clientid;
    res.redirect(`/${req.params.uuid}/resetpassword/newpassword`);
    return;
  }

  logger.audit(`Failed attempt to reset password id: ${req.body.uid} - Invalid code`, {
    type: 'reset-password',
    success: false,
    userId: req.body.uid,
    reqId: req.id,
  });

  validationResult.messages.code = 'The code you entered is incorrect. Please check and try again.';
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    uid: req.body.uid,
    code: req.body.code,
    validationFailed: true,
    validationMessages: validationResult.messages,
    reqId: req.id,
  });
};

module.exports = action;
