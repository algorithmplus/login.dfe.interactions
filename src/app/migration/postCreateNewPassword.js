'use strict';

const users = require('./../../infrastructure/Users');
const services = require('./../../infrastructure/Services');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const { validate } = require('./../utils/validatePassword');
const org = require('./../../infrastructure/Organisations');

const establishment = '001';
const localAuthority = '002';
const multiAcademyTrust = '010';
const singleAcademyTrust = '013';

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
    logger.warn(`Usercode no longer exists for ${req.body.emailConfId}`);
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

  const user = await users.create(userCode.userCode.email, req.body.newPassword, userToMigrate.firstName, userToMigrate.lastName, userToMigrate.userName, req.id);

  let orgId;
  if (userToMigrate.organisation.type === establishment) {
    orgId = userToMigrate.organisation.urn;
  } else if (userToMigrate.organisation.type === localAuthority) {
    orgId = userToMigrate.organisation.localAuthority;
  } else if (userToMigrate.organisation.type === multiAcademyTrust || userToMigrate.organisation.type === singleAcademyTrust) {
    orgId = userToMigrate.organisation.uid;
  }

  let userId;
  if (user) {
    userId = user.id;
  } else {
    const existingUser = await users.find(userCode.userCode.email, req.id);
    if (existingUser) {
      userId = existingUser.sub;
    }
  }
  const organisation = await org.getOrganisationByExternalId(orgId, userToMigrate.organisation.type);

  const externalIdentifiers = [];
  externalIdentifiers.push({ key: 'organisationId', value: userToMigrate.organisation.osaId });
  externalIdentifiers.push({ key: 'groups', value: (userToMigrate.service.roles ? userToMigrate.service.roles : []).join(',') });
  externalIdentifiers.push({ key: 'saUserId', value: userToMigrate.osaUserId });

  const servicesResult = await services.create(userId, userToMigrate.serviceId, organisation.id, externalIdentifiers, req.id);


  if (!servicesResult) {
    logger.audit(`Unsuccessful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId}) - unable to link user to organisation ${orgId} and to service id ${userToMigrate.serviceId}`, {
      type: 'sign-in',
      subType: 'migration',
      success: false,
      userId,
      userEmail: userCode.userCode.email,
    });
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

  logger.audit(`Successful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId})`, {
    type: 'sign-in',
    subType: 'migration',
    success: true,
    userId,
    userEmail: userCode.userCode.email,
  });

  req.session.migrationUser = undefined;

  req.session.redirectUri = userCode.userCode.redirectUri;

  res.redirect(`/${req.params.uuid}/migration/complete`);
};

module.exports = action;
