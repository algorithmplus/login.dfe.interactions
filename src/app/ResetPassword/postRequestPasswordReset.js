'use strict';

const emailValidator = require('email-validator');
const directoriesApi = require('./../../Users');
const clients = require('./../../Clients');
const userCodes = require('./../../UserCodes');
const logger = require('./../../logger')

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
    await userCodes.upsertCode(user.sub);
  } catch (e){
    logger.info(`Password reset requested for ${email} and failed`);
    logger.info(e);
  }

  res.render('ResetPassword/views/codesent');
};

module.exports = action;
