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
    const client = await clients.get(req.query.clientid, req.id);
    const user = await directoriesApi.find(email, client, req.id);
    await userCodes.upsertCode(user.sub, req.query.clientid, req.query.redirect_uri, req.id);
  } catch (e) {
    logger.info(`Password reset requested for ${email} and failed correlationId: ${req.id}`);
    logger.info(e);
  }

  res.render('ResetPassword/views/codesent', {
    uuid: req.params.uuid,
    clientid: req.query.clientid,
    email,
    title: 'Email sent',
    csrfToken: req.csrfToken(),
  });
};

module.exports = action;
