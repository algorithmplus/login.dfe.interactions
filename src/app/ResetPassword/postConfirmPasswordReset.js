'use strict';

const emailValidator = require('email-validator');
const directoriesApi = require('./../../infrastructure/Users');
const clients = require('./../../infrastructure/Clients');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');

const validate = (email, code) => {
  const messages = {};
  let failed = false;

  if (email.length === 0) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  } else if (!emailValidator.validate(email)) {
    messages.email = 'Please enter a valid email address';
    failed = true;
  }

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
  const validationResult = validate(req.body.email, req.body.code);

  if (validationResult.failed) {
    res.render('ResetPassword/views/confirm', {
      csrfToken: req.csrfToken(),
      email: req.body.email,
      code: req.body.code,
      validationFailed: true,
      validationMessages: validationResult.messages,
    });
    return;
  }

  let userCode;
  let user;
  try {
    const client = await clients.get(req.query.clientid, req.id);
    user = await directoriesApi.find(req.body.email, client, req.id);
    userCode = await userCodes.validateCode(user.sub, req.body.code, req.id);
  } catch (e) {
    logger.info(`Error confirming password reset for ${req.body.email} correlationId: ${req.id}`);
    logger.info(e);
  }

  if (userCode) {
    req.session.uid = user.sub;
    req.session.clientId = req.query.clientid;
    res.redirect(`/${req.params.uuid}/resetpassword/newpassword`);
    return;
  }

  if (user) {
    logger.audit(`Failed attempt to reset password for ${req.body.email} (id: ${user.sub}) - Invalid code`, {
      type: 'reset-password',
      success: false,
      userId: user.sub,
      reqId: req.id,
    });
  }
  validationResult.messages.code = 'The code you entered is incorrect. Please check and try again.';
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    email: req.body.email,
    code: req.body.code,
    validationFailed: true,
    validationMessages: validationResult.messages,
    reqId: req.id,
  });
};

module.exports = action;
