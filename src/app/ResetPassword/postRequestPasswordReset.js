'use strict';

const emailValidator = require('email-validator');
const directoriesApi = require('./../../infrastructure/Users');
const clients = require('./../../infrastructure/Clients');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');

const validate = (email) => {
  const messages = {
    email: '',
  };
  let failed = false;

  const emailValidationMessage = 'Please enter a valid email address';

  if (email.length === 0) {
    messages.email = emailValidationMessage;
    failed = true;
  } else if (!emailValidator.validate(email)) {
    messages.email = emailValidationMessage;
    failed = true;
  }

  return {
    messages,
    failed,
  };
};

const action = async (req, res) => {
  const email = req.body.email;
  const validationResult = validate(email);

  if (validationResult.failed) {
    res.render('ResetPassword/views/request', {
      csrfToken: req.csrfToken(),
      email,
      validationFailed: validationResult.failed,
      validationMessages: validationResult.messages,
    });
    return;
  }

  try {
    const client = await clients.get(req.query.clientid);
    const user = await directoriesApi.find(email, client);
    await userCodes.upsertCode(user.sub, req.query.clientid);
  } catch (e) {
    logger.info(`Password reset requested for ${email} and failed`);
    logger.info(e);
  }

  res.render('ResetPassword/views/codesent', {
    uuid: req.params.uuid,
    clientid: req.query.clientid,
  });
};

module.exports = action;
