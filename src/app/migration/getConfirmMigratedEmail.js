'use strict';

const userCodes = require('./../../infrastructure/UserCodes');

const get = async (req, res) => {
  const userCode = await userCodes.getCode(req.params.emailConfId, req.id, 'ConfirmMigratedEmail');

  if (!userCode) {
    throw new Error('Invalid Request');
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
