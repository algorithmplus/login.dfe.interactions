'use strict';

const org = require('./../../infrastructure/Organisations');

const establishment = '001';
const localAuthority = '002';
const multiAcademyTrust = '010';
const singleAcademyTrust = '013';

const validate = async (user) => {
  let orgId;
  if (user.organisation.type === establishment) {
    orgId = user.organisation.urn;
  } else if (user.organisation.type === localAuthority) {
    orgId = user.organisation.localAuthority;
  } else if (user.organisation.type === multiAcademyTrust || user.organisation.type === singleAcademyTrust) {
    orgId = user.organisation.uid;
  }

  if (!orgId) {
    return true;
  }

  const organisation = await org.getOrganisationByExternalId(orgId, user.organisation.type);

  return !organisation;
};

const get = async (req, res) => {
  const user = req.session.migrationUser;

  const validationResult = await validate(user);

  res.render('migration/views/userDetail', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    hideUserNav: true,
    user,
    validationMessages: {},
    failedValidation: validationResult,
  });
};

module.exports = get;
