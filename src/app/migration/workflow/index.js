'use strict';

const users = require('./../../../infrastructure/Users');
const services = require('./../../../infrastructure/Services');
const userCodes = require('./../../../infrastructure/UserCodes');
const logger = require('./../../../infrastructure/logger');
const org = require('./../../../infrastructure/Organisations');


const createOrFindUser = async (email, password, firstName, lastName, emailConfId, saUsername, correlationId) => {
  if(password) { // Will not have password when we have checked user exists
    logger.info(`Attempting to create user for ${saUsername} (email = ${email}, firstName = ${firstName}, lastName = ${lastName})`, { correlationId });
    const user = await users.create(email, password, firstName, lastName, emailConfId, saUsername, correlationId);
    if (user) {
      logger.info(`Created new user for SA user ${saUsername} with id ${user.id}`, { correlationId });
      return {
        userId: user.id,
        existing: false,
      };
    }
  }

  logger.info(`Did not create user for SA user ${saUsername}. Seeing if user already exists with email (${email})`, { correlationId });
  const existingUser = await users.find(email, correlationId);
  if (existingUser) {
    logger.info(`Found existing user for SA user ${saUsername} with id ${existingUser.sub}`, { correlationId });
    return {
      userId: existingUser.sub,
      existing: true,
    };
  }

  throw new Error(`Failed to create or find a user for SA user ${saUsername} (email: ${email})`);
};
const addUserToOrganisation = async (userId, saOrganisation, correlationId) => {
  const organisation = await org.getOrganisationByExternalId(saOrganisation.osaId, '000');
  if (!organisation) {
    throw new Error(`Failed to find an organisation of type ${saOrganisation.type} with SA id ${saOrganisation.osaId} for user ${userId}`);
  }

  logger.info(`Adding user ${userId} to organisation ${organisation.id} with role ${saOrganisation.role.id}`, { correlationId });
  await org.setUsersRoleAtOrg(userId, organisation.id, saOrganisation.role.id, correlationId);

  return organisation;
};
const addUserToService = async (userId, organisation, saOrganisation, currentServiceId, currentServiceRoles, saUserId, saUserName, correlationId) => {
  const externalIdentifiers = [];
  externalIdentifiers.push({ key: 'organisationId', value: saOrganisation.osaId });
  externalIdentifiers.push({
    key: 'groups',
    value: (currentServiceRoles || []).join(','),
  });
  externalIdentifiers.push({ key: 'saUserId', value: saUserId });
  externalIdentifiers.push({ key: 'saUserName', value: saUserName });

  const servicesResult = await services.create(userId, currentServiceId, organisation.id, externalIdentifiers, correlationId);
  return servicesResult;
};
const completeMigration = async (emailConfId, correlationId) => {
  await userCodes.deleteCode(emailConfId, correlationId, 'ConfirmMigratedEmail');
};

const migrate = async (emailConfId, email, password, firstName, lastName, saOrganisation, serviceId, serviceRoles, saUserId, saUsername, correlationId) => {
  const user = await createOrFindUser(email, password, firstName, lastName, saUsername, correlationId);

  const organisation = await addUserToOrganisation(user.userId, saOrganisation, correlationId);

  const servicesResult = await addUserToService(user.userId, organisation, saOrganisation, serviceId,
    serviceRoles, saUserId, saUsername, correlationId);
  if (!servicesResult) {
    logger.audit(`Unsuccessful migration for ${saUsername} to ${email} (id: ${user.userId}) - unable to link user to organisation ${organisation.id} and to service id ${serviceId}`, {
      type: 'sign-in',
      subType: 'migration',
      success: false,
      userId: user.userId,
      userEmail: email,
    });
    throw new Error('Error occurred migrating user services');
  }


  logger.audit(`Successful migration for ${saUsername} to ${email} (id: ${user.userId})`, {
    type: 'sign-in',
    subType: 'migration',
    success: true,
    userId: user.userId,
    userEmail: email,
  });

  await completeMigration(emailConfId, correlationId);
};

module.exports = {
  migrate,
};
