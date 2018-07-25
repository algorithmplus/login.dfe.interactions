'use strict';

const userCodes = require('./../../infrastructure/UserCodes');
const { migrate } = require('./workflow');

const post = async (req, res) => {
  if (req.body.radioEmailGroup && req.body.radioEmailGroup.toLowerCase() === 'yes') {
    const userCode = await userCodes.getCode(req.params.emailConfId, req.id, 'ConfirmMigratedEmail');
    const userToMigrate = JSON.parse(userCode.userCode.contextData);

    await migrate(req.params.emailConfId, userCode.userCode.email, undefined, userToMigrate.firstName, userToMigrate.lastName,
      userToMigrate.organisation, userToMigrate.serviceId, userToMigrate.service.roles, userToMigrate.osaUserId, userToMigrate.userName, req.id);

    req.session.migrationUser = undefined;
    req.session.redirectUri = userCode.userCode.redirectUri;
    req.session.clientId = userCode.userCode.clientId;
    return res.redirect(`/${req.params.uuid}/migration/complete`);
  }

  if (req.body.radioEmailGroup && req.body.radioEmailGroup.toLowerCase() === 'no') {
    return res.redirect(`/${req.params.uuid}/email`);
  }

  const user = req.session.migrationUser;
  return res.render('migration/views/email-in-use', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    user,
    hideUserNav: true,
    backLink: true,
    validationMessages: {},
  });
};

module.exports = post;
