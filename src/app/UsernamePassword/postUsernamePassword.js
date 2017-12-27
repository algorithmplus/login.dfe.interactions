const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../../infrastructure/Clients');
const Users = require('./../../infrastructure/Users');
const emailValidator = require('email-validator');
const logger = require('./../../infrastructure/logger');

const validateBody = (body) => {
  const validationMessages = {};
  validationMessages.failedValidation = false;
  if (body.username === '') {
    validationMessages.username_validationMessage = 'Enter your email address';
    validationMessages.failedValidation = true;
  } else if (!emailValidator.validate(body.username)) {
    validationMessages.username_validationMessage = 'Enter a valid email address';
    validationMessages.failedValidation = true;
  }

  if (body.password === '') {
    validationMessages.password_validationMessage = 'Enter your password';
    validationMessages.failedValidation = true;
  }
  return validationMessages;
};

const post = async (req, res) => {
  const client = await clients.get(req.query.clientid);
  if (client === null) {
    InteractionComplete.process(req.params.uuid, { status: 'failed', reason: 'invalid clientid' }, res);
    return;
  }

  if (req.body.cancel) {
    logger.info(`Cancelling username/password for uuid ${req.params.uuid}`);
    InteractionComplete.process(req.params.uuid, { status: 'cancelled', type: 'usernamepassword' }, res);
    return;
  }

  let user = null;
  const validation = validateBody(req.body);
  if (!validation.failedValidation) {
    user = await Users.authenticate(req.body.username, req.body.password, client);
  }

  if (user === null) {
    logger.audit(`Failed login attempt for ${req.body.username}`, {
      type: 'sign-in',
      subType: 'username-password',
      success: false,
      userEmail: req.body.username,
    });

    res.render('UsernamePassword/views/index', {
      emailValidationMessage: validation.username_validationMessage,
      passwordValidationMessage: validation.password_validationMessage,
      isFailedLogin: true,
      title: 'Sign in',
      clientId: req.query.clientid,
      uuid: req.params.uuid,
      message: 'Invalid email address or password. Try again.',
      csrfToken: req.csrfToken(),
      redirectUri: req.query.redirect_uri,
    });
    return;
  }

  logger.audit(`Successful login attempt for ${req.body.username} (id: ${user.id})`, {
    type: 'sign-in',
    subType: 'username-password',
    success: true,
    userId: user.id,
    userEmail: req.body.username,
  });
  InteractionComplete.process(req.params.uuid, { status: 'success', uid: user.id, type: 'usernamepassword' }, res);
};

module.exports = post;
