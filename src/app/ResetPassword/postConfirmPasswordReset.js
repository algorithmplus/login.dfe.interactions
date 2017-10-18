'use strict';

const emailValidator = require('email-validator');
const directoriesApi = require('./../../Users');
const clients = require('./../../Clients');
const userCodes = require('./../../UserCodes');
const logger = require('./../../logger');

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
  try{
    const client = await clients.get(req.query.clientid);
    user = await directoriesApi.find(req.body.email, client);
    userCode = await userCodes.validateCode(user.sub, req.body.code);
  } catch(e) {
    logger.info(`Error confirming password reset for ${req.body.email}`);
    logger.info(e);
  }

  if (userCode) {
    req.session.uid = user.sub;
    req.session.clientId = req.query.clientid;
    res.redirect(`/${req.params.uuid}/resetpassword/newpassword`);
    return;
  }

  validationResult.messages.code = 'The code you entered is incorrect. Please check and try again.';
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    email: req.body.email,
    code: req.body.code,
    validationFailed: true,
    validationMessages: validationResult.messages,
  });
};

module.exports = action;
