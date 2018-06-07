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


const validateInputAndUserCode = async (newPassword, confirmPassword, emailConfId, csrfToken, correlationId) => {
  const validationResult = {
    model: {
      csrfToken,
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      backLink: true,
      validationMessages: {},
      emailConfId,
    },
    userCode: null,
  };

  const result = validate(newPassword, confirmPassword);
  if (result.failed) {
    validationResult.model.validationMessages = result.messages;
    return validationResult;
  }

  validationResult.userCode = await userCodes.getCode(emailConfId, correlationId, 'ConfirmMigratedEmail');
  if (!validationResult.userCode || !validationResult.userCode.userCode || !validationResult.userCode.userCode.contextData) {
    logger.warn(`Usercode no longer exists for ${emailConfId}`);
    validationResult.model.validationMessages.general = 'An error has occurred.';
  }

  return validationResult;
};
const createOrFindUser = async (email, password, firstName, lastName, emailConfId, saUsername, correlationId) => {
  const user = await users.create(email, password, firstName, lastName, emailConfId, saUsername, correlationId);
  if (user) {
    return {
      userId: user.id,
      existing: false,
    };
  }

  const existingUser = await users.find(email, correlationId);
  if (existingUser) {
    return {
      userId: existingUser.sub,
      existing: true,
    };
  }

  return {
    userId: undefined,
    existing: false,
  };
};
const addUserToOrganisation = async (saOrganisation) => {
  let orgId;
  if (saOrganisation.type === establishment) {
    orgId = saOrganisation.urn;
  } else if (saOrganisation.type === localAuthority) {
    orgId = saOrganisation.localAuthority;
  } else if (saOrganisation.type === multiAcademyTrust || saOrganisation.type === singleAcademyTrust) {
    orgId = saOrganisation.uid;
  }
  const organisation = await org.getOrganisationByExternalId(orgId, saOrganisation.type);

  // TODO: Add user/org/role mapping to DSI

  return organisation;
};
const addUserToService = async (userId, organisation, saOrganisation, currentServiceId, currentServiceRoles, saUserId, correlationId) => {
  const externalIdentifiers = [];
  externalIdentifiers.push({ key: 'organisationId', value: saOrganisation.osaId });
  externalIdentifiers.push({
    key: 'groups',
    value: (currentServiceRoles || []).join(','),
  });
  externalIdentifiers.push({ key: 'saUserId', value: saUserId });

  const servicesResult = await services.create(userId, currentServiceId, organisation.id, externalIdentifiers, correlationId);
  return servicesResult;
};

const action = async (req, res) => {
  const validationResult = await validateInputAndUserCode(req.body.newPassword, req.body.confirmPassword, req.body.emailConfId, req.csrfToken(), req.id);
  if (Object.keys(validationResult.model.validationMessages).length > 0) {
    return res.render('migration/views/createPassword', validationResult.model);
  }

  const userCode = validationResult.userCode;
  const userToMigrate = JSON.parse(userCode.userCode.contextData);

  const user = await createOrFindUser(userCode.userCode.email, req.body.newPassword, userToMigrate.firstName, userToMigrate.lastName, userToMigrate.userName, req.id);
  const userId = user.userId;

  const organisation = await addUserToOrganisation(userToMigrate.organisation);

  const servicesResult = await addUserToService(userId, organisation, userToMigrate.organisation, userToMigrate.serviceId,
    userToMigrate.service.roles, userToMigrate.osaUserId, req.id);


  if (!servicesResult) {
    logger.audit(`Unsuccessful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId}) - unable to link user to organisation ${orgId} and to service id ${userToMigrate.serviceId}`, {
      type: 'sign-in',
      subType: 'migration',
      success: false,
      userId,
      userEmail: userCode.userCode.email,
    });

    validationResult.model.validationMessages.general = 'An error has occurred.';
    return res.render('migration/views/createPassword', validationResult.model);
  }

  logger.audit(`Successful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId})`, {
    type: 'sign-in',
    subType: 'migration',
    success: true,
    userId,
    userEmail: userCode.userCode.email,
  });

  await userCodes.deleteCode(req.body.emailConfId, req.id, 'ConfirmMigratedEmail');

  if (user.existing) {
    validationResult.model.validationMessages.general = 'Email address has already been registered. Please sign in using your email address';
    return res.render('migration/views/createPassword', validationResult.model);
  }

  req.session.migrationUser = undefined;
  req.session.redirectUri = userCode.userCode.redirectUri;
  return res.redirect(`/${req.params.uuid}/migration/complete`);
};

module.exports = action;
