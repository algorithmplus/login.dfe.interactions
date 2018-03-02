const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../../infrastructure/Clients');
const Users = require('./../../infrastructure/Users');
const emailValidator = require('email-validator');
const logger = require('./../../infrastructure/logger');
const { sendResult } = require('./../../infrastructure/utils');

const validateBody = (body) => {
  const validationMessages = {};
  let failedValidation = false;

  if (body.username === '') {
    validationMessages.username = 'Please enter your email address';
    failedValidation = true;
  } else if (!emailValidator.validate(body.username)) {
    validationMessages.username = 'Please enter a valid email address';
    failedValidation = true;
  }

  if (body.password === '') {
    validationMessages.password = 'Please enter your password';
    failedValidation = true;
  }
  return {
    validationMessages,
    failedValidation,
  };
};

const post = async (req, res) => {
  const client = await clients.get(req.query.clientid, req.id);
  if (client === null) {
    InteractionComplete.process(req.params.uuid, { status: 'failed', reason: 'invalid clientid' }, req, res);
    return;
  }

  if (req.body.cancel) {
    logger.info(`Cancelling username/password for uuid ${req.params.uuid}`);
    InteractionComplete.process(req.params.uuid, { status: 'cancelled', type: 'usernamepassword' }, req, res);
    return;
  }

  let user = null;
  const validation = validateBody(req.body);
  if (!validation.failedValidation) {
    user = await Users.authenticate(req.body.username, req.body.password, req.id);
  }

  if (user === null) {
    logger.audit(`Failed login attempt for ${req.body.username}`, {
      type: 'sign-in',
      subType: 'username-password',
      success: false,
      userEmail: req.body.username,
    });

    if (Object.keys(validation.validationMessages).length === 0 && validation.validationMessages.constructor === Object) {
      validation.validationMessages.loginError = 'Invalid email address or password. Try again.';
    }

    sendResult(req, res, 'UsernamePassword/views/indexEas', {
      isFailedLogin: true,
      title: 'DfE Sign-in',
      clientId: req.query.clientid,
      uuid: req.params.uuid,
      csrfToken: req.csrfToken(),
      redirectUri: req.query.redirect_uri,
      validationMessages: validation.validationMessages,
      username: req.body.username,
    });
  } else if (user.status === 'Deactivated') {
    logger.audit(`Attempt login to deactivated account for ${req.body.username}`, {
      type: 'sign-in',
      subType: 'username-password',
      success: false,
      userEmail: req.body.username,
    });

    if (Object.keys(validation.validationMessages).length === 0 && validation.validationMessages.constructor === Object) {
      validation.validationMessages.loginError = 'Your account has been deactivated.';
    }

    sendResult(req, res, 'UsernamePassword/views/indexEas', {
      isFailedLogin: true,
      title: 'DfE Sign-in',
      clientId: req.query.clientid,
      uuid: req.params.uuid,
      csrfToken: req.csrfToken(),
      redirectUri: req.query.redirect_uri,
      validationMessages: validation.validationMessages,
      username: req.body.username,
    });
  } else {
    logger.audit(`Successful login attempt for ${req.body.username} (id: ${user.id})`, {
      type: 'sign-in',
      subType: 'username-password',
      success: true,
      userId: user.id,
      userEmail: req.body.username,
    });
    InteractionComplete.process(req.params.uuid, {
      status: 'success',
      uid: user.id,
      type: 'usernamepassword',
    }, req, res);
  }
};

module.exports = post;
