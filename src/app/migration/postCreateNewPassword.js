'use strict';

const users = require('./../../infrastructure/Users');
const services = require('./../../infrastructure/Services');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const { validate } = require('./../utils/validatePassword');

const action = async (req, res) => {
  const validationResult = validate(req.body.newPassword, req.body.confirmPassword);

  if (validationResult.failed) {
    res.render('migration/views/createPassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      backLink: true,
      validationMessages: validationResult.messages,
      emailConfId: req.body.emailConfId,
    });
    return;
  }

  const userCode = await userCodes.getCode(req.body.emailConfId, req.id, 'ConfirmMigratedEmail');

  if (!userCode || !userCode.userCode || !userCode.userCode.contextData) {
    res.render('migration/views/createPassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      backLink: true,
      emailConfId: req.body.emailConfId,
      validationMessages: {
        general: 'An error has occurred.',
      },
    });
    return;
  }

  const userToMigrate = JSON.parse(userCode.userCode.contextData);

  const user = await users.create(userCode.userCode.email, req.body.newPassword, userToMigrate.firstName, userToMigrate.lastName, req.id);

  await userCodes.deleteCode(req.body.emailConfId, req.id, 'ConfirmMigratedEmail');

  if (!user) {
    res.render('migration/views/createPassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      backLink: true,
      emailConfId: req.body.emailConfId,
      validationMessages: {
        general: 'Email address has already been registered. Please sign in using your email address',
      },
    });
    return;
  }

  let orgId;
  if(userToMigrate.organisation.type === '001') {
    orgId = userToMigrate.organisation.urn;
  } else {
    orgId = userToMigrate.organisation.uid;
  }

  services.create(user.id, userToMigrate.serviceId, orgId, userToMigrate.organisation.type, req.id);

  req.session.migrationUser = undefined;

  req.session.redirectUri = userCode.userCode.redirectUri;

  res.redirect(`/${req.params.uuid}/migration/complete`);
};

module.exports = action;
