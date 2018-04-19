'use strict';

const emailValidator = require('email-validator');
const userCodes = require('./../../infrastructure/UserCodes');

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
  const migrationUser = req.session.migrationUser;
  const currentEmail = req.body.radioEmailGroup;
  let email = req.body.email;
  if (currentEmail && currentEmail.toLowerCase() === 'yes') {
    email = migrationUser.email;
  }

  const viewToDisplay = req.body.viewToDisplay;
  const validationResult = validate(email);


  if (validationResult.failed) {
    res.render(viewToDisplay, {
      csrfToken: req.csrfToken(),
      email,
      uuid: req.params.uuid,
      validationFailed: validationResult.failed,
      validationMessages: validationResult.messages,
      backLink: true,
      viewToDisplay,
    });
    return;
  }

  const code = await userCodes.upsertCode(undefined, migrationUser.clientId, migrationUser.redirectUri, req.id, 'ConfirmMigratedEmail', email, migrationUser);

  res.redirect(`/${req.params.uuid}/migration/${code.uid}/confirm-email`);
};

module.exports = action;
