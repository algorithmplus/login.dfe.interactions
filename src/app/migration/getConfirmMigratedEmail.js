'use strict';

const userCodes = require('./../../infrastructure/UserCodes');

const get = async (req, res) => {
  const userCode = await userCodes.getCode(req.params.emailConfId, req.id, 'ConfirmMigratedEmail');

  if (!userCode) {
    return res.status(410).render('migration/views/alreadyMigrated', {
      title: 'Sign in with your new details',
      user: undefined,
      hideUserNav: true,
    });
  }

  res.render('migration/views/confirmEmail', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    emailConfId: req.params.emailConfId,
    csrfToken: req.csrfToken(),
    backLink: true,
    validationMessages: {},
    email: userCode.userCode.email,
    resend: req.session.resend,
  });
};

module.exports = get;
