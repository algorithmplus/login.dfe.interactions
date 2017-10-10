const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../Clients');
const Users = require('./../Users');
const emailValidator = require('email-validator');


const validateBody = (body) => {
  const validationMessages = {};
  validationMessages.failedValidation = false;
  if (body.username === '') {
    validationMessages.username_validationMessage = 'Email address must be supplied';
    validationMessages.failedValidation = true;
  }
  else if (!emailValidator.validate(body.username)){
    validationMessages.username_validationMessage = 'Email address must be supplied in the correct format';
    validationMessages.failedValidation = true;
  }

  if (body.password === '') {
    validationMessages.password_validationMessage = 'Password must be supplied';
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

  let user = null;
  const validation = validateBody(req.body);
  if (!validation.failedValidation) {
    user = await Users.authenticate(req.body.username, req.body.password, client);
  }

  if (user === null) {
    res.render('usernamepassword/index', {
      emailValidationMessage: validation.username_validationMessage, passwordValidationMessage: validation.password_validationMessage, isFailedLogin: true, message: 'Invalid email address or password. Try again.', csrfToken: req.csrfToken(),
    });
    return;
  }
  InteractionComplete.process(req.params.uuid, { status: 'success', uid: user.id }, res);
};

module.exports = post;
