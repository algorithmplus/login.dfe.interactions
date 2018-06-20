'use strict';

const org = require('./../../infrastructure/Organisations');

const validate = async (user) => {
  const organisation = await org.getOrganisationByExternalId(user.organisation.osaId, '000');

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
