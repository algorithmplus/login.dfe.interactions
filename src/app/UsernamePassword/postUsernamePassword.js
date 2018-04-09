const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../../infrastructure/Clients');
const Users = require('./../../infrastructure/Users');
const emailValidator = require('email-validator');
const logger = require('./../../infrastructure/logger');
const { sendRedirect, sendResult } = require('./../../infrastructure/utils');
const osaAuthenticate = require('./../../infrastructure/osa');

const validateBody = (body, allowUserName) => {
  const validationMessages = {};
  let failedValidation = false;

  if (body.username === '') {
    if (allowUserName) {
      validationMessages.username = 'Please enter your email address or username';
    } else {
      validationMessages.username = 'Please enter your email address';
    }
    failedValidation = true;
  } else if (!emailValidator.validate(body.username) && !allowUserName) {
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

  let user = null;
  let legacyUser = false;
  const supportsUsernameLogin = client.params && client.params.supportsUsernameLogin;
  const validation = validateBody(req.body, supportsUsernameLogin);
  if (!validation.failedValidation) {
    if (emailValidator.validate(req.body.username)) {
      user = await Users.authenticate(req.body.username, req.body.password, req.id);
    } else {
      legacyUser = true;
      user = await osaAuthenticate.authenticate(req.body.username, req.body.password, req.id);
    }
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

    sendResult(req, res, 'UsernamePassword/views/index', {
      isFailedLogin: true,
      title: 'DfE Sign-in',
      clientId: req.query.clientid,
      uuid: req.params.uuid,
      csrfToken: req.csrfToken(),
      redirectUri: req.query.redirect_uri,
      validationMessages: validation.validationMessages,
      username: req.body.username,
      header: !client.params || client.params.header,
      headerMessage: !client.params || client.params.headerMessage,
      allowUserNameLogin: !client.params || client.params.allowUserNameLogin,
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

    sendResult(req, res, 'UsernamePassword/views/index', {
      isFailedLogin: true,
      title: 'DfE Sign-in',
      clientId: req.query.clientid,
      uuid: req.params.uuid,
      csrfToken: req.csrfToken(),
      redirectUri: req.query.redirect_uri,
      validationMessages: validation.validationMessages,
      username: req.body.username,
      header: !client.params || client.params.header,
      headerMessage: !client.params || client.params.headerMessage,
      allowUserNameLogin: !client.params || client.params.allowUserNameLogin,
    });
  } else if (legacyUser) {
    req.session.migrationUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organisation: user.organisation,
      clientId: req.query.clientid,
      redirectUri: req.query.redirect_uri,
    };
    sendRedirect(req, res, {
      redirect: true,
      uri: `/${req.params.uuid}/migration`,
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
      clientId: req.body.clientId,
      redirectUri: req.body.redirectUri,
    }, req, res);
  }
};

module.exports = post;
