'use strict';

const org = require('./../../infrastructure/Organisations');

const validate = async (user) => {
  let orgId;
  if (user.organisation.type === '001') {
    orgId = user.organisation.urn;
  } else if (user.organisation.type === '010' || user.organisation.type === '013') {
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
