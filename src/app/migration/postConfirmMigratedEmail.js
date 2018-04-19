'use strict';

const userCodes = require('./../../infrastructure/UserCodes');


const validate = (code) => {
  const messages = {
    code: '',
  };
  let failed = false;

  const emailValidationMessage = 'Please enter a valid code';

  if (code.length === 0) {
    messages.code = emailValidationMessage;
    failed = true;
  }
  return {
    messages,
    failed,
  };
};


const action = async (req, res) => {
  req.session.userCode = undefined;

  const uid = req.body.emailConfId;
  const code = req.body.code;
  const validationResult = validate(code);


  if (validationResult.failed) {
    res.render('migration/views/confirmEmail', {
      csrfToken: req.csrfToken(),
      emailConfId: req.body.emailConfId,
      backLink: true,
      validationFailed: validationResult.failed,
      validationMessages: validationResult.messages,
    });
    return;
  }

  const userCode = await userCodes.validateCode(uid, code, req.id, 'ConfirmMigratedEmail');

  if (!userCode) {
    res.render('migration/views/confirmEmail', {
      csrfToken: req.csrfToken(),
      emailConfId: req.body.emailConfId,
      backLink: true,
      validationFailed: true,
      validationMessages: {
        code: 'Please enter a valid code',
      },
    });
    return;
  }

  req.session.userCode = code;

  res.redirect(`/${req.params.uuid}/migration/${req.body.emailConfId}/new-password`);
};

module.exports = action;
